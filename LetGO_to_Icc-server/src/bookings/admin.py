from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "short_id",
        "user",
        "driver",
        "type",
        "time",
        "status",
        "created_at",
    )
    list_filter = ("type", "status", "created_at")
    list_editable = ("status",)
    search_fields = (
        "user__name",
        "user__last_name",
        "driver__name",
        "driver__last_name",
        "address",
        "pickup_location",
        "dropoff_location",
    )
    readonly_fields = ("id", "created_at", "updated_at")
    raw_id_fields = ("user", "driver")
    ordering = ("-created_at",)

    fieldsets = (
        ("Trip", {
            "fields": ("user", "driver", "type", "time", "status"),
        }),
        ("Locations", {
            "fields": ("address", "pickup_location", "dropoff_location"),
        }),
        ("Notes", {
            "fields": ("notes",),
        }),
        ("Metadata", {
            "classes": ("collapse",),
            "fields": ("id", "created_at", "updated_at"),
        }),
    )

    actions = ["cancel_bookings", "confirm_bookings"]

    @admin.action(description="Cancel selected bookings")
    def cancel_bookings(self, request, queryset):
        queryset.update(status="cancelled")

    @admin.action(description="Confirm selected bookings")
    def confirm_bookings(self, request, queryset):
        queryset.update(status="confirmed")

    @admin.display(description="ID")
    def short_id(self, obj):
        return str(obj.id)[:8]
