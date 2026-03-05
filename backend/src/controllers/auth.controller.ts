/**
 * @file backend/src/controllers/authController.ts
 * @description Authentication controller:
 * - register: creates user with correct defaults (status + availability)
 * - login: sends OTP ONLY if user exists and is approved
 * - verifyOtp: verifies OTP + issues JWT ONLY if user is approved
 *
 * BUSINESS RULES:
 * - status values: "pending" | "approved" | "blocked"
 * - member: status = "approved" at creation
 * - driver/admin: status = "pending" at creation
 * - driver: availability default true
 * - blocked or pending users cannot login / cannot verify
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpSMS } from "../services/otpProvider.js";
import { generateOTP, makeSalt, hashOtp, safeEq } from "../utils/otp.js";

const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 300);
const OTP_RESEND_COOLDOWN_SECONDS = Number(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || 60
);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

type Role = "member" | "driver" | "admin";
type Status = "pending" | "approved" | "blocked";

function statusMessage(status: Status) {
  if (status === "blocked") {
    return "Your account has been blocked. Please contact the administrator.";
  }
  if (status === "pending") {
    return "Your account is pending approval. Please contact the administrator.";
  }
  return "Your account is not approved yet. Please contact the administrator.";
}

function isRole(v: any): v is Role {
  return v === "member" || v === "driver" || v === "admin";
}

function isStatus(v: any): v is Status {
  return v === "pending" || v === "approved" || v === "blocked";
}

/**
 * REGISTER
 * Accepts:
 * - fullName, phoneNumber, role
 * - address (required for member/driver; not required for admin)
 * - driver fields required when role=driver
 */
export const register = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }

    const {
      fullName,
      phoneNumber,
      role,
      address,
      carModel,
      carColor,
      carPlate,
      carType,
      carYear,
    } = req.body as {
      fullName?: string;
      phoneNumber?: string;
      role?: Role;
      address?: string;
      carModel?: string;
      carColor?: string;
      carPlate?: string;
      carType?: string;
      carYear?: string;
    };

    if (!fullName || !phoneNumber || !role) {
      return res
        .status(400)
        .json({ error: "fullName, phoneNumber and role are required." });
    }

    if (!isRole(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    // Address required unless admin
    if (role !== "admin" && (!address || String(address).trim().length < 3)) {
      return res
        .status(400)
        .json({ error: "Address is required for members and drivers." });
    }

    // Driver required fields
    if (role === "driver") {
      if (!carModel || String(carModel).trim().length < 2) {
        return res.status(400).json({ error: "Car model is required." });
      }
      if (!carPlate || String(carPlate).trim().length < 2) {
        return res.status(400).json({ error: "Car plate is required." });
      }
      if (!carYear || !/^\d{4}$/.test(String(carYear))) {
        return res.status(400).json({ error: "Car year must be 4 digits." });
      }
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists." });
    }

    // ✅ status defaults (member approved, driver/admin pending)
    const status: Status = role === "member" ? "approved" : "pending";

    // ✅ driver availability default true (admin will edit later)
    const availability = role === "driver" ? true : undefined;

    const user = new User({
      fullName,
      phoneNumber,
      role,
      status,
      availability,
      address: role === "admin" ? undefined : address,

      // driver-only
      carModel: role === "driver" ? carModel : undefined,
      carColor: role === "driver" ? carColor : undefined,
      carPlate: role === "driver" ? carPlate : undefined,
      carType: role === "driver" ? carType : undefined,
      carYear: role === "driver" ? carYear : undefined,
    });

    const savedUser = await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ error: "Server error during registration." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body as { phoneNumber?: string };

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const user = await User.findOne({ phoneNumber }).select("+otp");
    if (!user) {
      return res
        .status(404)
        .json({ error: "User with this phone number does not exist." });
    }

    // ✅ STATUS GATE (no OTP for pending/blocked)
    const statusRaw = (user as any).status;
    const status: Status = isStatus(statusRaw) ? statusRaw : "pending";

    if (status !== "approved") {
      return res.status(403).json({ error: statusMessage(status) });
    }

    const now = new Date();

    if (user.otp?.lastSentAt instanceof Date) {
      const since = (now.getTime() - user.otp.lastSentAt.getTime()) / 1000;

      if (since < OTP_RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          error: `Please wait ${
            OTP_RESEND_COOLDOWN_SECONDS - Math.floor(since)
          }s before requesting another code.`,
        });
      }
    }

    const code = generateOTP();
    const salt = makeSalt();
    const codeHash = hashOtp(code, salt);
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

    user.otp = {
      codeHash,
      salt,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
    };

    await user.save();

    const { dev } = await sendOtpSMS(phoneNumber, code);

    const payload: { message: string; userId: string; devOtp?: string } = {
      message: "OTP sent successfully.",
      userId: user._id.toString(),
    };

    if (dev) payload.devOtp = code;

    return res.status(200).json(payload);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error during login." });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body as {
      phoneNumber?: string;
      otp?: string;
    };

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: "Phone number and OTP required." });
    }

    const user = await User.findOne({ phoneNumber }).select("+otp");
    if (!user || !user.otp) {
      return res
        .status(400)
        .json({ error: "Invalid request. Please login again." });
    }

    // ✅ STATUS GATE (even if OTP correct, still blocked/pending cannot enter)
    const statusRaw = (user as any).status;
    const status: Status = isStatus(statusRaw) ? statusRaw : "pending";

    if (status !== "approved") {
      return res.status(403).json({ error: statusMessage(status) });
    }

    const { expiresAt, attempts, salt, codeHash } = user.otp;

    if (!salt || !codeHash) {
      return res.status(400).json({ error: "Invalid OTP data." });
    }

    if (attempts >= OTP_MAX_ATTEMPTS) {
      user.otp = undefined;
      await user.save();
      return res
        .status(429)
        .json({ error: "Too many attempts. Please request a new OTP." });
    }

    if (expiresAt instanceof Date && expiresAt < new Date()) {
      user.otp = undefined;
      await user.save();
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new OTP." });
    }

    const providedHash = hashOtp(otp, salt);
    const valid = safeEq(providedHash, codeHash);

    if (!valid) {
      user.otp.attempts = attempts + 1;
      await user.save();
      return res.status(400).json({ error: "Invalid OTP." });
    }

    user.otp = undefined;
    if (!user.phoneVerifiedAt) user.phoneVerifiedAt = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "OTP verified. Login successful.",
      token,
      user: {
        id: user._id,
        fullName: (user as any).fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        address: (user as any).address,
        status: (user as any).status,
        availability: (user as any).availability,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res
      .status(500)
      .json({ error: "Server error during OTP verification." });
  }
};