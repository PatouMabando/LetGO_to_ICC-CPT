
import twilio, { Twilio } from "twilio";

interface OtpResult {
  delivered: boolean;
  dev: boolean;
}

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  NODE_ENV,
} = process.env;

const hasTwilio: boolean =
  !!TWILIO_ACCOUNT_SID &&
  !!TWILIO_AUTH_TOKEN &&
  !!TWILIO_PHONE_NUMBER;

let client: Twilio | null = null;

if (hasTwilio) {
  client = twilio(TWILIO_ACCOUNT_SID as string, TWILIO_AUTH_TOKEN as string);
}

export async function sendOtpSMS(
  phone: string,
  code: string
): Promise<OtpResult> {
  const isProd = NODE_ENV === "production";

  if (!isProd || !hasTwilio) {
    console.log(`[DEV] OTP for ${phone}: ${code}`);
    return { delivered: false, dev: true };
  }

  if (!client) {
    throw new Error("Twilio client is not initialized");
  }

  await client.messages.create({
    body: `Your verification code is ${code}`,
    from: TWILIO_PHONE_NUMBER as string,
    to: phone,
  });

  return { delivered: true, dev: false };
}
