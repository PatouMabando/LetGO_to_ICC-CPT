import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendOtpSMS } from "../services/otpProvider.js";
import { generateOTP, makeSalt, hashOtp, isE164, safeEq } from "../utils/otp.js";


const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 300); // 5 minutes
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }
// function makeSalt(bytes = 16) {
//   return crypto.randomBytes(bytes).toString("hex");
// }
// function hashOtp(code, salt) {
//   return crypto.createHmac("sha256", salt).update(code).digest("hex");
// }
// function safeEq(a, b) {
//   const A = Buffer.from(a);
//   const B = Buffer.from(b);
//   if (A.length !== B.length) return false;
//   return crypto.timingSafeEqual(A, B);
// }

export const register = async (req, res) => {
    try {
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
        return res.status(400).json({ error: "User with this phone number already exists." });
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
  
      res.status(201).json({ message: "User created successfully", user: savedUser });
  
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Server error during registration." });
    }
};
  
export const login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({ phoneNumber }).select("+otp");
    if (!user) {
      return res.status(404).json({ error: "User with this phone number does not exist." });
    }

    const now = new Date();
    if (user.otp?.lastSentAt) {
      const since = Math.floor((now - new Date(user.otp.lastSentAt)) / 1000);
      if (since < OTP_RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          error: `Please wait ${OTP_RESEND_COOLDOWN_SECONDS - since}s before requesting another code.`,
        });
      }
    }

    // Generate + hash OTP for dev purpose
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

    // In dev, return OTP to make testing easy; in prod it won't be included
    const payload = { message: "OTP sent successfully.", userId: user._id };
    if (dev) payload.devOtp = code;

    return res.status(200).json(payload);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error during login." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber }).select("+otp");
    if (!user || !user.otp) {
      return res.status(400).json({ error: "Invalid request. Please login again." });
    }

    const { expiresAt, attempts, salt, codeHash } = user.otp;

    // Attempts cap
    if (attempts >= OTP_MAX_ATTEMPTS) {
      user.otp = undefined;
      await user.save();
      return res.status(429).json({ error: "Too many attempts. Please request a new OTP." });
    }

    // Expired?
    if (new Date(expiresAt) < new Date()) {
      user.otp = undefined;
      await user.save();
      return res.status(400).json({ error: "OTP expired. Please request a new OTP." });
    }

    // Validate
    const providedHash = hashOtp(otp, salt);
    const ok = safeEq(providedHash, codeHash);

    //Invalid OPT
    if (!ok) {
      user.otp.attempts = attempts + 1;
      await user.save();
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Success
    user.otp = undefined;
    if (!user.phoneVerifiedAt) user.phoneVerifiedAt = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber, role: user.role },
      process.env.JWT_SECRET,
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
    return res.status(500).json({ error: "Server error during OTP verification." });
  }
};  
  
