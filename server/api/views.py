from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Room, User, TournamentHistory, WinLoseHistory, OneVsOneHistory
from .serializers import (
    RoomSerializer,
    UserSerializer,
    TournamentHistorySerializer,
    WinLoseHistorySerializer,
    OneVsOneHistorySerializer,
)
import json
from django.utils import timezone


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
class CreateMatchView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            user1 = User.objects.get(uuid=data["user1_uuid"])
            user2 = User.objects.get(uuid=data["user2_uuid"])
            win_user_uuid = data.get("win_user")
            win_user = user1 if win_user_uuid == str(user1.uuid) else user2
            match = OneVsOneHistory.objects.create(
                uuid=uuid.uuid4(),
                play_time=timezone.now(),
                user1=user1,
                user2=user2,
                win_user=win_user,
            )
            return Response(
                {
                    "message": "Match created successfully",
                    "match_uuid": str(match.uuid),
                },
                status=status.HTTP_201_CREATED,
            )
        except KeyError as e:
            return Response(
                {"error": f"Missing data: {e}"}, status=status.HTTP_400_BAD_REQUEST
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


class UserDetailView(APIView):
    def get(self, request, uuid, format=None):
        user = User.objects.get(uuid=uuid)
        user_data = UserSerializer(user).data

        tournament_histories = (
            TournamentHistory.objects.filter(user1=user)
            | TournamentHistory.objects.filter(user2=user)
            | TournamentHistory.objects.filter(user3=user)
            | TournamentHistory.objects.filter(user4=user)
        )
        win_lose_histories = WinLoseHistory.objects.filter(user_uuid=user)
        one_vs_one_histories = OneVsOneHistory.objects.filter(
            user1=user
        ) | OneVsOneHistory.objects.filter(user2=user)

        user_data["tournament_histories"] = TournamentHistorySerializer(
            tournament_histories, many=True
        ).data
        user_data["win_lose_histories"] = WinLoseHistorySerializer(
            win_lose_histories, many=True
        ).data
        user_data["one_vs_one_histories"] = OneVsOneHistorySerializer(
            one_vs_one_histories, many=True
        ).data

        return Response(user_data)
