import { z } from 'zod';

const saPhoneRegex = /^(\+27|0)\d{9}$/;


// LOGIN (PHONE ONLY)

export const loginSchema = z.object({
  phone: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .refine((v) => v.length > 0, {
      message: "Please fill out the phone number field",
    })
    .refine((v) => /^\+?\d+$/.test(v), {
      message: "Phone number must not contain letters or symbols",
    })
    .refine((v) => v.startsWith("+27"), {
      message: "Phone number must start with +27",
    })
    .refine((v) => saPhoneRegex.test(v), {
      message:
        "Please type the full South African mobile number (e.g. +27780492663)",
    }),
});
// OTP (OTP ONLY)
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits"),
});


export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "First name is required")
        .min(2, "First name must be at least 2 characters"),
    
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .min(2, "Last name must be at least 2 characters"),
    
    phoneNumber: z
        .string()
        .transform((v) => v.replace(/\s/g, ""))
        .refine((v) => v.length > 0, { message: "Phone number is required" })
        .refine((v) => saPhoneRegex.test(v), {
            message: "Please enter a valid South African phone number",
        }),
    role: z.enum(["member", "driver", "admin"]),
    carYear: z
        .string()
        .optional()
        .refine((v) => !v || /^\d{4}$/.test(v), {
            message: "Enter a valid 4-digit year (e.g. 2018)",
        }),
    carModel: z
        .string()
        .optional()
        .refine((v) => !v || v.length >= 2, {
            message: "Car model must be at least 2 characters",
        }),
    carColor: z
        .string()
        .optional()
        .refine((v) => !v || v.length >= 2, {
            message: "Car color must be at least 2 characters",
        }),
    carPlate: z
        .string()
        .optional()
        .refine((v) => !v || v.length >= 2, {
            message: "Car license plate must be at least 2 characters",
        }),
    carType: z
        .string()
        .optional()
        .refine((v) => !v || v.length >= 2, {
            message: "Car type must be at least 2 characters",
        }),
});
