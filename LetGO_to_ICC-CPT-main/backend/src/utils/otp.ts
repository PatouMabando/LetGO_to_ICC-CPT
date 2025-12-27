import crypto from "crypto";

/**
 * Generate a 6-digit numeric OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a cryptographic salt
 */
export function makeSalt(bytes: number = 16): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Hash OTP using HMAC-SHA256
 * Suitable for short-lived OTPs
 */
export function hashOtp(code: string, salt: string): string {
  const hmac = crypto.createHmac("sha256", salt);
  hmac.update(code);
  return hmac.digest("hex");
}

/**
 * Validate E.164 formatted phone number
 */
export function isE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

/**
 * Timing-safe string comparison
 */
export function safeEq(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}
