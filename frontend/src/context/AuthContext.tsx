// src/context/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import type { Role, User } from "../api/auth";
import { authApi } from "../api/auth";

/**
 * FILE: src/context/AuthContext.tsx
 * PURPOSE:
 * - Central auth state for the app (token, user, role, phoneNumber)
 * - Exposes actions: startLogin (send OTP), verifyOtp (login), logout
 * - Persists token + user in localStorage so refresh keeps session
 */

type Ctx = {
  user: User | null;
  token: string | null;
  role?: Role;
  phoneNumber: string;
  startLogin: (phone: string) => Promise<{ devOtp?: string }>;
  verifyOtp: (otp: string) => Promise<User>;
  logout: () => void;
  setPhoneNumber: (v: string) => void;
};

const AuthContext = createContext<Ctx | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const [phoneNumber, setPhoneNumber] = useState("");

  async function startLogin(phone: string) {
    const res = await authApi.startLogin(phone);
    setPhoneNumber(phone);
    return { devOtp: res.devOtp };
  }

  async function verifyOtp(otp: string) {
    const res = await authApi.verifyOtp(otp, phoneNumber);

    setToken(res.token);
    setUser(res.user);

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    return res.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
    setPhoneNumber("");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const role = useMemo(() => user?.role, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      phoneNumber,
      startLogin,
      verifyOtp,
      logout,
      setPhoneNumber,
    }),
    [user, token, role, phoneNumber]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}