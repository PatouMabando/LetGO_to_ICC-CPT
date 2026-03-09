from django.urls import path

from . import views

urlpatterns = [
    path("bookings", views.driver_bookings),
    path("start-trip", views.start_trip),
    path("availability", views.update_availability),
]
