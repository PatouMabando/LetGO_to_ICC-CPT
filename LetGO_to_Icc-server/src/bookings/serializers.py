from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    # Map snake_case DB fields to the camelCase the frontend expects
    userId = serializers.UUIDField(source="user_id", read_only=True)
    driverId = serializers.UUIDField(source="driver_id", read_only=True)
    pickupLocation = serializers.CharField(source="pickup_location")
    dropoffLocation = serializers.CharField(source="dropoff_location")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "userId",
            "driverId",
            "type",
            "time",
            "address",
            "pickupLocation",
            "dropoffLocation",
            "notes",
            "status",
            "createdAt",
            "updatedAt",
        ]


class BookingWithDriverSerializer(serializers.ModelSerializer):
    """Booking with populated driver data (like Mongoose .populate)."""
    userId = serializers.UUIDField(source="user_id", read_only=True)
    driverId = UserSerializer(source="driver", read_only=True)
    pickupLocation = serializers.CharField(source="pickup_location")
    dropoffLocation = serializers.CharField(source="dropoff_location")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "userId",
            "driverId",
            "type",
            "time",
            "address",
            "pickupLocation",
            "dropoffLocation",
            "notes",
            "status",
            "createdAt",
            "updatedAt",
        ]
