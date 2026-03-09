from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import User
from .permissions import IsAdmin, IsAuthenticated
from .serializers import UserSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def list_members(request):
    members = User.objects.filter(role="member")
    return Response(UserSerializer(members, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def list_drivers(request):
    drivers = User.objects.filter(role="driver")
    return Response(UserSerializer(drivers, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def list_admins(request):
    admins = User.objects.filter(role="admin")
    return Response(UserSerializer(admins, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_stats(request):
    from django.db.models import Count, Q

    qs = User.objects.values("role", "status").annotate(count=Count("id"))
    stats = {
        "approvedMembers": 0,
        "approvedDrivers": 0,
        "pendingDrivers": 0,
        "pendingMembers": 0,
        "pendingAdmins": 0,
    }
    for row in qs:
        role, st, c = row["role"], row["status"], row["count"]
        if role == "member" and st == "approved":
            stats["approvedMembers"] = c
        elif role == "driver" and st == "approved":
            stats["approvedDrivers"] = c
        elif role == "driver" and st == "pending":
            stats["pendingDrivers"] = c
        elif role == "member" and st == "pending":
            stats["pendingMembers"] = c
        elif role == "admin" and st == "pending":
            stats["pendingAdmins"] = c
    return Response(stats)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def add_user(request):
    name = request.data.get("name")
    last_name = request.data.get("lastName")
    phone_number = request.data.get("phoneNumber")
    role = request.data.get("role")

    if not all([name, last_name, phone_number, role]):
        return Response(
            {"error": "Missing required fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(phone_number=phone_number).exists():
        return Response(
            {"error": "Phone number already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(
        phone_number=phone_number,
        name=name,
        last_name=last_name,
        role=role,
    )
    return Response(
        {"message": "User added", "user": UserSerializer(user).data},
        status=status.HTTP_201_CREATED,
    )


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def user_detail(request, id):
    """Handle PUT (edit) and DELETE (remove) for a single user."""
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "DELETE":
        user.delete()
        return Response({"message": "User removed"})

    # PUT — edit user
    for field, attr in [
        ("name", "name"),
        ("lastName", "last_name"),
        ("phoneNumber", "phone_number"),
        ("status", "status"),
    ]:
        value = request.data.get(field)
        if value:
            setattr(user, attr, value)

    if request.data.get("availability") and user.role == "driver":
        user.availability = request.data["availability"]

    user.save()
    return Response(
        {"message": "User updated", "user": UserSerializer(user).data}
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def set_user_status(request, id):
    new_status = request.data.get("status")
    if new_status not in ("approved", "blocked", "pending"):
        return Response(
            {"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
        )

    user.status = new_status
    user.save(update_fields=["status"])
    return Response({"message": f"User status set to {new_status}"})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def set_driver_availability(request, id):
    availability = request.data.get("availability")
    if availability not in ("available", "not_available"):
        return Response(
            {"error": "Invalid availability"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(pk=id, role="driver")
    except User.DoesNotExist:
        return Response(
            {"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND
        )

    user.availability = availability
    user.save(update_fields=["availability"])
    return Response(
        {"message": f"Driver availability set to {availability}"}
    )
