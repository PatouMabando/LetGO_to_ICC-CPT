import { z } from 'zod';

const saPhoneRegex = /^(\+27|0)\d{9}$/;

export const loginSchema = z.object({
    phone: z.string().min(1),
    otp: z.string().optional(),
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
