from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    # Map DB field names to the camelCase the frontend expects
    lastName = serializers.CharField(source="last_name")
    phoneNumber = serializers.CharField(source="phone_number")
    fullName = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "lastName",
            "fullName",
            "phoneNumber",
            "role",
            "status",
            "availability",
            "address",
            "car_model",
            "car_color",
            "car_plate",
            "car_type",
            "car_year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_fullName(self, obj):
        return f"{obj.name} {obj.last_name}".strip()


class LoginUserSerializer(serializers.Serializer):
    """Returned after OTP verification — matches the original API shape."""
    id = serializers.UUIDField()
    name = serializers.CharField()
    lastName = serializers.CharField(source="last_name")
    fullName = serializers.SerializerMethodField()
    phoneNumber = serializers.CharField(source="phone_number")
    role = serializers.CharField()
    status = serializers.CharField()
    availability = serializers.CharField()

    def get_fullName(self, obj):
        return f"{obj.name} {obj.last_name}".strip()
