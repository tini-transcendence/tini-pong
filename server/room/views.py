from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Room, RoomUser
from user.models import User
from .serializers import RoomSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your views here.


class RoomListView(APIView):
    def get(self, request, *args, **kwargs):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response({"rooms": serializer.data})


@method_decorator(csrf_exempt, name="dispatch")
class CreateRoomView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            owner = User.objects.get(uuid=request.data.get("owner_uuid"))
            room = Room.objects.create(
                name=request.data.get("name"),
                type=request.data.get("type"),
                difficulty=request.data.get("difficulty"),
                owner_uuid=owner,
            )
            return Response(
                {"message": "Room created successfully"}, status=status.HTTP_201_CREATED
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Owner not found"}, status=status.HTTP_404_NOT_FOUND
            )


@method_decorator(csrf_exempt, name="dispatch")
class DeleteRoomView(APIView):
    def delete(self, request, uuid, *args, **kwargs):
        try:
            room = Room.objects.get(uuid=uuid)
            room.delete()
            return Response(
                {"message": "Room deleted successfully"}, status=status.HTTP_200_OK
            )
        except Room.DoesNotExist:
            return Response(
                {"message": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )


@method_decorator(csrf_exempt, name="dispatch")
class JoinRoomView(APIView):
    def post(self, request, *args, **kwargs):
        room_uuid = request.data.get("room_uuid")
        user_uuid = request.data.get("user_uuid")
        try:
            room = Room.objects.get(uuid=room_uuid)
            user = User.objects.get(uuid=user_uuid)

            # 방이 이미 게임을 시작했는지 확인
            if room.is_active:
                return Response(
                    {"error": "The game has already started."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 방의 인원이 모두 찼는지 확인
            if room.room_users.count() >= room.max_players:
                return Response(
                    {"error": "The room is full."}, status=status.HTTP_400_BAD_REQUEST
                )

            # 사용자를 방에 추가합니다.
            RoomUser.objects.create(room_uuid=room, user_uuid=user)
            channel_layer = get_channel_layer()
            group_name = f"room_{room_uuid}"

            async_to_sync(channel_layer.group_add)(group_name, user_uuid)
            return Response(
                {"message": "Joined room successfully"}, status=status.HTTP_200_OK
            )
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
