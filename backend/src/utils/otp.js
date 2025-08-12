
import crypto from "crypto";

export function generateOTP() {
  // 6-digit numeric
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function makeSalt(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hashOtp(code, salt) {
  // Fast HMAC is fine for short-lived OTPs
  const h = crypto.createHmac("sha256", salt);
  h.update(code);
  return h.digest("hex");
}

export function isE164(phone) {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

export function safeEq(a, b) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}
