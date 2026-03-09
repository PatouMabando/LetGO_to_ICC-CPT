import { z } from "zod";

const saPhoneRegex = /^\+27\d{9}$/;

// LOGIN
export const loginSchema = z.object({
  phone: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .refine((v) => v.length > 0, { message: "Please fill out the phone number field" })
    .refine((v) => /^\+?\d+$/.test(v), { message: "Phone number must not contain letters or symbols" })
    .refine((v) => v.startsWith("+27"), { message: "Phone number must start with +27" })
    .refine((v) => saPhoneRegex.test(v), {
      message: "Please type the full South African mobile number (e.g. +27780492663)",
    }),
});

// OTP
export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

// REGISTER
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters"),

    phoneNumber: z
      .string()
      .transform((v) => v.replace(/\s/g, ""))
      .refine((v) => v.length > 0, { message: "Phone number is required" })
      .refine((v) => /^\+?\d+$/.test(v), { message: "Phone number must not contain letters or symbols" })
      .refine((v) => v.startsWith("+27"), { message: "Phone number must start with +27" })
      .refine((v) => saPhoneRegex.test(v), {
        message: "Please type the full South African mobile number (e.g. +27780492663)",
      }),

    address: z.string().optional(),
    role: z.enum(["member", "driver", "admin"]),

    carYear: z.string().optional(),
    carModel: z.string().optional(),
    carColor: z.string().optional(),
    carPlate: z.string().optional(),
    carType: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Address required unless admin
    if (data.role !== "admin") {
      if (!data.address || data.address.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address is required",
          path: ["address"],
        });
      }
    }

    // Driver validations
    if (data.role === "driver") {
      if (!data.carModel || data.carModel.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Car model is required",
          path: ["carModel"],
        });
      }

      if (!data.carPlate || data.carPlate.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Car plate is required",
          path: ["carPlate"],
        });
      }

      if (!data.carYear || !/^\d{4}$/.test(data.carYear)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid 4-digit year",
          path: ["carYear"],
        });
      }
    }
  });