from django.contrib import admin
from django.urls import path
from . import views
from .views import RoomListView

urlpatterns = [
    path("rooms/", RoomListView.as_view(), name="rooms_list"),
    path("create_room/", views.create_room, name="create_room"),
    path("delete_room/<uuid:uuid>/", views.delete_room, name="delete_room"),
    path("create_match/", views.create_match, name="create_match"),
]
