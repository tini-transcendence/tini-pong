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
            # 방장을 방에 추가
            RoomUser.objects.create(room_uuid=room, user_uuid=owner)
            # 웹소켓 그룹 생성
            channel_layer = get_channel_layer()
            group_name = f"room_{room.uuid}"
            async_to_sync(channel_layer.group_add)(group_name, owner.uuid)

            return Response(
                {"message": "Room created successfully", "room_uuid": str(room.uuid)},
                status=status.HTTP_201_CREATED,
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

            # 사용자를 방에 추가
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


@method_decorator(csrf_exempt, name="dispatch")
class LeaveRoomView(APIView):
    def post(self, request, *args, **kwargs):
        room_uuid = request.data.get("room_uuid")
        user_uuid = request.data.get("user_uuid")
        try:
            room = Room.objects.get(uuid=room_uuid)
            user = User.objects.get(uuid=user_uuid)

            # 사용자가 방에 있는지 확인
            room_user = RoomUser.objects.filter(room_uuid=room, user_uuid=user).first()
            if not room_user:
                return Response(
                    {"error": "User is not in the room."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 채널 레이어에서 사용자를 그룹에서 제거
            channel_layer = get_channel_layer()
            group_name = f"room_{room_uuid}"

            # 방장이 방을 나가는 경우 모든 사용자를 내보내고 방을 삭제
            if room.owner_uuid == user_uuid:
                room_users = RoomUser.objects.filter(room_uuid=room)
                for member in room_users:
                    async_to_sync(channel_layer.group_discard)(
                        group_name, member.user_uuid
                    )
                    member.delete()

                room.delete()
                return Response(
                    {"message": "Room closed and all users removed by owner"},
                    status=status.HTTP_200_OK,
                )
            else:
                # 방장이 아닌 경우 해당 사용자만 제거
                async_to_sync(channel_layer.group_discard)(
                    group_name, user.channel_name
                )
                room_user.delete()

                return Response(
                    {"message": "Left room successfully"}, status=status.HTTP_200_OK
                )
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
