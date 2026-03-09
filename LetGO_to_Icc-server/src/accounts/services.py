import logging
import os

from django.conf import settings

logger = logging.getLogger(__name__)


def send_otp_sms(phone: str, code: str) -> dict:
    """
    Send OTP via Twilio in production, or log to console in dev.
    Returns {"delivered": bool, "dev": bool}.
    """
    is_prod = os.getenv("DJANGO_ENV", "development") == "production"
    has_twilio = bool(
        settings.TWILIO_ACCOUNT_SID
        and settings.TWILIO_AUTH_TOKEN
        and settings.TWILIO_PHONE_NUMBER
    )

    if not is_prod or not has_twilio:
        logger.info("[DEV] OTP for %s: %s", phone, code)
        return {"delivered": False, "dev": True}

    from twilio.rest import Client

    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    client.messages.create(
        body=f"Your verification code is {code}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone,
    )
    return {"delivered": True, "dev": False}
