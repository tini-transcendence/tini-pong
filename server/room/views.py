from rest_framework.views import APIView
from rest_framework import status
from django.utils.decorators import method_decorator
from .models import Room, RoomUser
from user.models import User
from .serializers import RoomSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import JsonResponse
from util.sanitize import sanitize

# Create your views here.


class RoomListView(APIView):
    def get(self, request, *args, **kwargs):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return JsonResponse({"rooms": serializer.data})


class CreateRoomView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            print("")
            print("create 들어옴 !!")
            print("")
            room = Room.objects.create(
                name=sanitize(request.data.get("name")),
                type=request.data.get("type"),
                difficulty=request.data.get("difficulty"),
                owner_uuid_id=request.user_uuid,
            )
            room_user = RoomUser.objects.create(
                room_uuid=room,
                user_uuid_id=request.user_uuid,
                is_ready=False,
                player_number=1,
            )

            channel_layer = get_channel_layer()
            group_name = f"room_{room.uuid}"
            async_to_sync(channel_layer.group_add)(group_name, request.user_uuid)
            return JsonResponse(
                {"message": "Room created successfully", "room_uuid": str(room.uuid)},
                status=status.HTTP_201_CREATED,
            )
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "Owner not found"}, status=status.HTTP_404_NOT_FOUND
            )


class DeleteRoomView(APIView):
    def delete(self, request, uuid, *args, **kwargs):
        try:
            room = Room.objects.get(uuid=uuid)
            room.delete()
            return JsonResponse(
                {"message": "Room deleted successfully"}, status=status.HTTP_200_OK
            )
        except Room.DoesNotExist:
            return JsonResponse(
                {"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )


class JoinRoomView(APIView):
    def post(self, request, *args, **kwargs):
        print("")
        print("join 들어옴 !!")
        print("")
        room_uuid = request.data.get("room_uuid")
        user_uuid_id = request.user_uuid
        try:
            room = Room.objects.get(uuid=room_uuid)
            user = User.objects.get(uuid=user_uuid_id)

            if room.is_active:
                # 게임이 이미 시작되었을 때
                return JsonResponse(
                    {"error": "게임이 이미 시작된 상태입니다."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if room.type == 1 and room.room_users.count() >= 2:
                # 1vs1 방에 인원이 이미 차 있을때
                return JsonResponse(
                    {"error": "방의 최대인원수를 초과하였습니다."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            elif room.room_users.count() >= 4:
                # 2vs2, 토너먼트 방에 인원이 이미 차 있을때
                return JsonResponse(
                    {"error": "방의 최대인원수를 초과하였습니다."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            RoomUser.objects.create(room_uuid=room, user_uuid=user)
            channel_layer = get_channel_layer()
            group_name = f"room_{room_uuid}"

            async_to_sync(channel_layer.group_add)(group_name, user_uuid_id)
            return JsonResponse(
                {"message": "Joined room successfully"}, status=status.HTTP_200_OK
            )
        except Room.DoesNotExist:
            return JsonResponse(
                {"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
