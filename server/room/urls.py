from django.urls import path
from .views import (
    RoomListView,
    CreateRoomView,
    DeleteRoomView,
)

urlpatterns = [
    path("list/", RoomListView.as_view(), name="rooms_list"),
    path("create/", CreateRoomView.as_view(), name="create_room"),
    path("delete/<uuid:uuid>/", DeleteRoomView.as_view(), name="delete_room"),
]
