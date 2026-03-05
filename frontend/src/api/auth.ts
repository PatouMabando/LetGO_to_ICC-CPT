// src/api/auth.ts
import { BASE, asJson } from "./index";

/**
 * FILE: src/api/auth.ts
 * PURPOSE:
 * - Defines Auth API types + calls for login (send OTP) and verify OTP.
 * - Must match backend response shape.
 */

export type Role = "member" | "driver" | "admin";
export type Status = "pending" | "approved" | "blocked";

export type User = {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: Role;

  // optional: admin may not have address
  address?: string;

  // ✅ NEW (backend adds these)
  status: Status;

  // ✅ NEW (only drivers will have it)
  availability?: boolean;
};

export type LoginStartResponse = {
  message: string;
  userId: string;
  devOtp?: string;
};

export type VerifyOtpResponse = {
  message: string;
  token: string;
  user: User;
};


// api calls from backend related to auth (login, verify OTP)
export const authApi = {
  startLogin(phoneNumber: string) {
    return fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    }).then(asJson<LoginStartResponse>);
  },

  verifyOtp(otp: string, phoneNumber: string) {
    return fetch(`${BASE}/api/auth/verifyOtp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, otp }),
    }).then(asJson<VerifyOtpResponse>);
  },
};