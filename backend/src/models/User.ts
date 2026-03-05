/**
 * @file backend/src/models/User.ts
 * @description Mongoose schema for User.
 *
 * BUSINESS RULES:
 * - phoneNumber must be South Africa only: +27 + 9 digits
 * - fullName is a single field
 * - address required for member/driver, optional for admin
 * - status exists for EVERY user:
 *   "pending" | "approved" | "blocked"
 *
 * DEFAULT STATUS LOGIC:
 * - member  -> approved
 * - driver  -> pending
 * - admin   -> pending
 *
 * Driver also has:
 * - availability (boolean) default true
 */

import mongoose from "mongoose";

// South Africa only: +27 + 9 digits
const ZA_E164_REGEX = /^\+27\d{9}$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v: string) => ZA_E164_REGEX.test(v),
        message:
          "Phone number must be a valid South African number in +27 format (e.g. +27780492663)",
      },
    },

    role: {
      type: String,
      enum: ["driver", "member", "admin"],
      default: "member",
      required: true,
    },

    // Required for member/driver, optional for admin
    address: {
      type: String,
      trim: true,
      required: function (this: any) {
        return this.role !== "admin";
      },
    },

    // Status system (every user)
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      required: true,
      default: function (this: any) {
        // Member is auto-approved
        if (this.role === "member") return "approved";
        // Admin & Driver need approval
        return "pending";
      },
    },

    // 🚗 DRIVER FIELDS (only required if role=driver)
    carModel: {
      type: String,
      trim: true,
      required: function (this: any) {
        return this.role === "driver";
      },
      minlength: 2,
    },

    carColor: {
      type: String,
      trim: true,
    },

    carPlate: {
      type: String,
      trim: true,
      required: function (this: any) {
        return this.role === "driver";
      },
      minlength: 2,
    },

    carType: {
      type: String,
      trim: true,
    },

    carYear: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || /^\d{4}$/.test(v),
        message: "Car year must be a valid 4-digit year",
      },
      required: function (this: any) {
        return this.role === "driver";
      },
    },

    // ✅ DRIVER AVAILABILITY (driver only)
    availability: {
      type: Boolean,
      default: true,
      required: function (this: any) {
        return this.role === "driver";
      },
    },

    // 🔐 OTP (subdocument)
    otp: {
      _id: false,
      codeHash: String,
      salt: String,
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
      lastSentAt: Date,
    },

    phoneVerifiedAt: Date,
  },
  { timestamps: true }
);

// Safer unique index (keeps DB consistent)
userSchema.index({ phoneNumber: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
