from django.urls import path
from .views import RoomListView, CreateRoomView, DeleteRoomView, CreateMatchView

urlpatterns = [
    path("rooms/", RoomListView.as_view(), name="rooms_list"),
    path("create_room/", CreateRoomView.as_view(), name="create_room"),
    path("delete_room/<uuid:uuid>/", DeleteRoomView.as_view(), name="delete_room"),
    path("create_match/", CreateMatchView.as_view(), name="create_match"),
]
