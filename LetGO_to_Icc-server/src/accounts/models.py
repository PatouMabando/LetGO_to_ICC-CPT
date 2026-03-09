import re
import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator
from django.db import models

E164_REGEX = re.compile(r"^\+[1-9]\d{6,14}$")

e164_validator = RegexValidator(
    regex=E164_REGEX,
    message="Phone number must be in E.164 format (e.g. +27821234567)",
)


class UserManager(BaseUserManager):
    def create_user(self, phone_number, name, last_name, **extra):
        if not phone_number:
            raise ValueError("Phone number is required")
        user = self.model(
            phone_number=phone_number, name=name, last_name=last_name, **extra
        )
        # No password — OTP-only auth
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, name, last_name, password=None, **extra):
        extra.setdefault("role", "admin")
        extra.setdefault("status", "approved")
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        user = self.model(
            phone_number=phone_number, name=name, last_name=last_name, **extra
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    class Role(models.TextChoices):
        MEMBER = "member", "Member"
        DRIVER = "driver", "Driver"
        ADMIN = "admin", "Admin"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        BLOCKED = "blocked", "Blocked"

    class Availability(models.TextChoices):
        AVAILABLE = "available", "Available"
        NOT_AVAILABLE = "not_available", "Not Available"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone_number = models.CharField(
        max_length=16, unique=True, validators=[e164_validator]
    )

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.MEMBER)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.APPROVED
    )
    availability = models.CharField(
        max_length=15,
        choices=Availability.choices,
        default=Availability.NOT_AVAILABLE,
    )

    # Car details (driver only)
    car_model = models.CharField(max_length=100, blank=True, default="")
    car_color = models.CharField(max_length=50, blank=True, default="")
    car_plate = models.CharField(max_length=20, blank=True, default="")
    car_type = models.CharField(max_length=50, blank=True, default="")
    car_year = models.CharField(max_length=10, blank=True, default="")

    # OTP fields
    otp_code_hash = models.CharField(max_length=128, blank=True, default="")
    otp_salt = models.CharField(max_length=64, blank=True, default="")
    otp_expires_at = models.DateTimeField(null=True, blank=True)
    otp_attempts = models.IntegerField(default=0)
    otp_last_sent_at = models.DateTimeField(null=True, blank=True)

    phone_verified_at = models.DateTimeField(null=True, blank=True)
    address = models.CharField(max_length=500, blank=True, default="")

    # Django auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["name", "last_name"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.name} {self.last_name} ({self.phone_number})"

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def clear_otp(self):
        self.otp_code_hash = ""
        self.otp_salt = ""
        self.otp_expires_at = None
        self.otp_attempts = 0
        self.save(
            update_fields=[
                "otp_code_hash",
                "otp_salt",
                "otp_expires_at",
                "otp_attempts",
            ]
        )
