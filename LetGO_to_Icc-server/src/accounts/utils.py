import hashlib
import hmac
import os
import re
import secrets


def generate_otp() -> str:
    """Generate a 6-digit numeric OTP."""
    return str(secrets.randbelow(900000) + 100000)


def make_salt(byte_length: int = 16) -> str:
    """Generate a cryptographic salt."""
    return secrets.token_hex(byte_length)


def hash_otp(code: str, salt: str) -> str:
    """Hash OTP using HMAC-SHA256."""
    return hmac.new(
        salt.encode(), code.encode(), hashlib.sha256
    ).hexdigest()


def is_e164(phone: str) -> bool:
    """Validate E.164 formatted phone number."""
    return bool(re.match(r"^\+[1-9]\d{6,14}$", phone))


def safe_eq(a: str, b: str) -> bool:
    """Timing-safe string comparison."""
    return hmac.compare_digest(a.encode(), b.encode())
