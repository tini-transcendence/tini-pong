from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from websocket.consumers import RoomConsumer

websocket_urlpatterns = [
    re_path(r"ws/room/(?P<room_uuid>[\w-]+)", RoomConsumer.as_asgi()),
]
