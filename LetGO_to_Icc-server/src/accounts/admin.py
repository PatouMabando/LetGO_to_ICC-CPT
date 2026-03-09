from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # List view
    list_display = (
        "phone_number",
        "name",
        "last_name",
        "role",
        "status",
        "availability",
        "is_active",
        "created_at",
    )
    list_filter = ("role", "status", "availability", "is_active")
    search_fields = ("name", "last_name", "phone_number", "address")
    ordering = ("-created_at",)

    # List-editable for quick changes
    list_editable = ("status", "availability")

    # Detail view fieldsets
    fieldsets = (
        ("Personal Info", {
            "fields": ("name", "last_name", "phone_number", "address"),
        }),
        ("Role & Status", {
            "fields": ("role", "status", "availability", "is_active"),
        }),
        ("Car Details (Drivers only)", {
            "classes": ("collapse",),
            "fields": ("car_model", "car_color", "car_plate", "car_type", "car_year"),
        }),
        ("Verification", {
            "classes": ("collapse",),
            "fields": ("phone_verified_at",),
        }),
        ("Metadata", {
            "classes": ("collapse",),
            "fields": ("id", "created_at", "updated_at"),
        }),
    )
    readonly_fields = ("id", "created_at", "updated_at")

    # Add user form — no password needed
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "phone_number",
                "name",
                "last_name",
                "role",
                "status",
            ),
        }),
    )

    # Custom actions
    actions = ["approve_users", "block_users", "set_available", "set_not_available"]

    @admin.action(description="Approve selected users")
    def approve_users(self, request, queryset):
        queryset.update(status="approved")

    @admin.action(description="Block selected users")
    def block_users(self, request, queryset):
        queryset.update(status="blocked")

    @admin.action(description="Set selected drivers as available")
    def set_available(self, request, queryset):
        queryset.filter(role="driver").update(availability="available")

    @admin.action(description="Set selected drivers as not available")
    def set_not_available(self, request, queryset):
        queryset.filter(role="driver").update(availability="not_available")

    # No password field needed
    def save_model(self, request, obj, form, change):
        if not change:
            obj.set_unusable_password()
        super().save_model(request, obj, form, change)
