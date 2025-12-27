import mongoose from "mongoose";

const E164_REGEX = /^\+[1-9]\d{6,14}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => E164_REGEX.test(v),
        message: "Phone number must be in E.164 format (e.g. +27821234567)",
      },
    },

    role: {
      type: String,
      enum: ["driver", "member", "admin"],
      default: "member",
    },

    carModel: {
      type: String,
    },
    carColor: {
      type: String,
    },
    carPlate: {
      type: String,
    },
    carType: {
      type: String,
    },
    carYear: {
      type: String,
    },
    otp: {
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

const User = mongoose.model("User", userSchema);
export default User;
