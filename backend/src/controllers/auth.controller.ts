
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpSMS } from "../services/otpProvider.js";
import {
  generateOTP,
  makeSalt,
  hashOtp,
  safeEq,
} from "../utils/otp.js";

const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 300);
const OTP_RESEND_COOLDOWN_SECONDS = Number(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || 60
);

const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);


export const register = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }

    const {
      name,
      lastName,
      phoneNumber,
      role,
      carModel,
      carColor,
      carPlate,
      carType,
      carYear,
    } = req.body;

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists." });
    }

    const user = new User({
      name,
      lastName,
      phoneNumber,
      role,
      carModel,
      carColor,
      carPlate,
      carType,
      carYear,
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

    const now = new Date();

    if (user.otp?.lastSentAt instanceof Date) {
      const since =
        (now.getTime() - user.otp.lastSentAt.getTime()) / 1000;

      if (since < OTP_RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          error: `Please wait ${OTP_RESEND_COOLDOWN_SECONDS - Math.floor(since)
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

    const payload: {
      message: string;
      userId: string;
      devOtp?: string;
    } = {
      message: "OTP sent successfully.",
      userId: user._id.toString(),
    };

    if (dev) payload.devOtp = code;

    return res.status(200).json(payload);
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ error: "Server error during login." });
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
    if (!user.phoneVerifiedAt) {
      user.phoneVerifiedAt = new Date();
    }
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
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res
      .status(500)
      .json({ error: "Server error during OTP verification." });
  }
};
