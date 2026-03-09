from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.models import User
from accounts.permissions import IsAuthenticated

from .models import Booking
from .serializers import BookingSerializer, BookingWithDriverSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def book_trip(request):
    user = request.user
    data = request.data

    required = ["type", "time", "address", "pickupLocation", "dropoffLocation", "driverId"]
    if not all(data.get(f) for f in required):
        return Response(
            {"error": "Missing required fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Save address to user profile
    user.address = data["address"]
    user.save(update_fields=["address"])

    booking = Booking.objects.create(
        user=user,
        driver_id=data["driverId"],
        type=data["type"],
        time=data["time"],
        address=data["address"],
        pickup_location=data["pickupLocation"],
        dropoff_location=data["dropoffLocation"],
        notes=data.get("notes", ""),
        status="confirmed",
    )

    return Response(
        {
            "message": "Trip booked successfully",
            "booking": BookingSerializer(booking).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def booking_history(request):
    bookings = Booking.objects.filter(user=request.user).select_related("driver")
    return Response(BookingWithDriverSerializer(bookings, many=True).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def address_view(request):
    if request.method == "GET":
        return Response({"address": request.user.address})

    # POST
    address = request.data.get("address")
    if not address:
        return Response(
            {"error": "Missing address"}, status=status.HTTP_400_BAD_REQUEST
        )
    request.user.address = address
    request.user.save(update_fields=["address"])
    return Response({"message": "Address updated"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def track_driver(request, booking_id):
    try:
        booking = Booking.objects.select_related("driver").get(
            pk=booking_id, user=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND
        )
    # Placeholder — real implementation would return driver GPS location
    return Response({"location": None})
