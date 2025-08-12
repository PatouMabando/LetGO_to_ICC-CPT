
import twilio from "twilio";

const hasTwilio =
  !!process.env.TWILIO_ACCOUNT_SID &&
  !!process.env.TWILIO_AUTH_TOKEN &&
  !!process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (hasTwilio) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function sendOtpSMS(phone, code) {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd || !hasTwilio) {
    console.log(`[DEV] OTP for ${phone}: ${code}`);
    return { delivered: false, dev: true };
  }

  await client.messages.create({
    body: `Your verification code is ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });

  return { delivered: true, dev: false };
}
