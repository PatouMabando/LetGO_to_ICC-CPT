import uuid

from django.db import models

from accounts.models import User


class Booking(models.Model):
    class TripType(models.TextChoices):
        ONE_WAY = "one-way", "One Way"
        ROUND_TRIP = "round-trip", "Round Trip"

    class Status(models.TextChoices):
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bookings_as_user"
    )
    driver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings_as_driver",
    )
    type = models.CharField(max_length=15, choices=TripType.choices)
    time = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    pickup_location = models.CharField(max_length=500, blank=True, default="")
    dropoff_location = models.CharField(max_length=500, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.CONFIRMED
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bookings"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Booking {self.id} — {self.user} → {self.driver}"
