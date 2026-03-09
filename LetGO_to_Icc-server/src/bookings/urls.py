from django.urls import path

from . import views

urlpatterns = [
    path("", views.book_trip),
    path("history", views.booking_history),
    path("address", views.address_view),  # GET + POST on same path
    path("track/<uuid:booking_id>", views.track_driver),
]
