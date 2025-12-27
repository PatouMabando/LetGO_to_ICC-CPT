import { BASE, asJson } from "./index";

export type User = {
    id: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    role: "member" | "driver" | "admin";
};

export type LoginStartResponse = { message: string; userId: string; devOtp?: string };
export type VerifyOtpResponse = { message: string; token: string; user: User };

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
