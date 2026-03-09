import logging
from datetime import timedelta

import jwt
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import User
from .serializers import LoginUserSerializer
from .services import send_otp_sms
from .utils import generate_otp, hash_otp, make_salt, safe_eq

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    full_name = (request.data.get("fullName") or "").strip()
    phone_number = (request.data.get("phoneNumber") or "").strip()
    role = request.data.get("role", "member")
    address = (request.data.get("address") or "").strip()

    if not full_name or not phone_number:
        return Response(
            {"error": "Full name and phone number are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if role not in ("member", "driver", "admin"):
        return Response(
            {"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(phone_number=phone_number).exists():
        return Response(
            {"error": "A user with this phone number already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Split fullName into name + last_name
    parts = full_name.split(None, 1)
    name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""

    extra = {"role": role, "address": address}

    # Driver car fields
    if role == "driver":
        extra["car_model"] = (request.data.get("carModel") or "").strip()
        extra["car_color"] = (request.data.get("carColor") or "").strip()
        extra["car_plate"] = (request.data.get("carPlate") or "").strip()
        extra["car_type"] = (request.data.get("carType") or "").strip()
        extra["car_year"] = (request.data.get("carYear") or "").strip()

    user = User.objects.create_user(
        phone_number=phone_number, name=name, last_name=last_name, **extra
    )

    return Response(
        {"message": "Registration successful. You can now log in.", "userId": str(user.id)},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    phone_number = request.data.get("phoneNumber")
    if not phone_number:
        return Response(
            {"error": "Phone number is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(phone_number=phone_number)
    except User.DoesNotExist:
        return Response(
            {"error": "User with this phone number does not exist."},
            status=status.HTTP_404_NOT_FOUND,
        )

    now = timezone.now()

    # Resend cooldown
    if user.otp_last_sent_at:
        since = (now - user.otp_last_sent_at).total_seconds()
        if since < settings.OTP_RESEND_COOLDOWN_SECONDS:
            wait = settings.OTP_RESEND_COOLDOWN_SECONDS - int(since)
            return Response(
                {"error": f"Please wait {wait}s before requesting another code."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

    code = generate_otp()
    salt = make_salt()
    code_hash = hash_otp(code, salt)
    expires_at = now + timedelta(seconds=settings.OTP_TTL_SECONDS)

    user.otp_code_hash = code_hash
    user.otp_salt = salt
    user.otp_expires_at = expires_at
    user.otp_attempts = 0
    user.otp_last_sent_at = now
    user.save(
        update_fields=[
            "otp_code_hash",
            "otp_salt",
            "otp_expires_at",
            "otp_attempts",
            "otp_last_sent_at",
        ]
    )

    result = send_otp_sms(phone_number, code)

    payload = {
        "message": "OTP sent successfully.",
        "userId": str(user.id),
    }
    if result.get("dev"):
        payload["devOtp"] = code

    return Response(payload, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp_view(request):
    phone_number = request.data.get("phoneNumber")
    otp = request.data.get("otp")

    if not phone_number or not otp:
        return Response(
            {"error": "Phone number and OTP required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(phone_number=phone_number)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid request. Please login again."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not user.otp_code_hash or not user.otp_salt:
        return Response(
            {"error": "Invalid request. Please login again."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Max attempts
    if user.otp_attempts >= settings.OTP_MAX_ATTEMPTS:
        user.clear_otp()
        return Response(
            {"error": "Too many attempts. Please request a new OTP."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    # Expiry check
    if user.otp_expires_at and user.otp_expires_at < timezone.now():
        user.clear_otp()
        return Response(
            {"error": "OTP expired. Please request a new OTP."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Verify
    provided_hash = hash_otp(otp, user.otp_salt)
    if not safe_eq(provided_hash, user.otp_code_hash):
        user.otp_attempts += 1
        user.save(update_fields=["otp_attempts"])
        return Response(
            {"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST
        )

    # Success — clear OTP and issue JWT
    user.otp_code_hash = ""
    user.otp_salt = ""
    user.otp_expires_at = None
    user.otp_attempts = 0
    if not user.phone_verified_at:
        user.phone_verified_at = timezone.now()
    user.save(
        update_fields=[
            "otp_code_hash",
            "otp_salt",
            "otp_expires_at",
            "otp_attempts",
            "phone_verified_at",
        ]
    )

    token = jwt.encode(
        {
            "id": str(user.id),
            "phoneNumber": user.phone_number,
            "role": user.role,
            "exp": timezone.now() + timedelta(seconds=settings.JWT_EXPIRATION_SECONDS),
        },
        settings.JWT_SECRET,
        algorithm="HS256",
    )

    user_data = LoginUserSerializer(user).data

    return Response(
        {
            "message": "OTP verified. Login successful.",
            "token": token,
            "user": user_data,
        },
        status=status.HTTP_200_OK,
    )
