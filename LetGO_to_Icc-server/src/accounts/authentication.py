import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import User


class JWTAuthentication(BaseAuthentication):
    """
    Custom JWT authentication matching the original Node.js implementation.
    Expects header: Authorization: Bearer <token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET, algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        try:
            user = User.objects.get(pk=payload["id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        # Attach decoded claims so views can access role, phone, etc.
        request.jwt_payload = payload
        return (user, payload)
