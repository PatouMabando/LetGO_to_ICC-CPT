from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/admin/", include("accounts.admin_urls")),
    path("api/driver/", include("drivers.urls")),
]
