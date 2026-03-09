from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.models import User
from accounts.permissions import IsAuthenticated
from bookings.models import Booking


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def driver_bookings(request):
    driver = request.user
    if driver.role != "driver":
        return Response(
            {"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
        )
    confirmed = Booking.objects.filter(driver=driver, status="confirmed").count()
    completed = Booking.objects.filter(driver=driver, status="cancelled").count()
    return Response({"confirmed": confirmed, "completed": completed})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_trip(request):
    return Response(
        {"message": "Trip started. Open map to follow route."}
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_availability(request):
    driver = request.user
    availability = request.data.get("availability")

    if availability not in ("available", "not_available"):
        return Response(
            {"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST
        )

    if driver.role != "driver":
        return Response(
            {"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND
        )

    driver.availability = availability
    driver.save(update_fields=["availability"])
    return Response({"message": f"Availability updated to {availability}"})
