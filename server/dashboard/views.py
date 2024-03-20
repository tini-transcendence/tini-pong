from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, TournamentHistory, WinLoseHistory, OneVsOneHistory
from .serializers import (
    UserSerializer,
    TournamentHistorySerializer,
    WinLoseHistorySerializer,
    OneVsOneHistorySerializer,
)
import json
from django.utils import timezone


class DashBoardView(APIView):
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
