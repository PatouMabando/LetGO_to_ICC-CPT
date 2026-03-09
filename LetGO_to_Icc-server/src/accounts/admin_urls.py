from django.urls import path

from . import admin_views

urlpatterns = [
    path("members", admin_views.list_members),
    path("drivers", admin_views.list_drivers),
    path("admins", admin_views.list_admins),
    path("stats", admin_views.admin_stats),
    path("user", admin_views.add_user),
    path("user/<uuid:id>", admin_views.user_detail),  # PUT + DELETE
    path("user/<uuid:id>/status", admin_views.set_user_status),
    path("driver/<uuid:id>/availability", admin_views.set_driver_availability),
]
