from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, OneVsOneGameResult, TwoVsTwoGameResult, TournamentGameResult
from .serializers import (
    OneVsOneGameResultSerializer,
    TwoVsTwoGameResultSerializer,
    TournamentGameResultSerializer,
)


class OneVsOneGameResultsView(APIView):
    def get(self, request, user_uuid):
        try:
            user = User.objects.get(uuid=user_uuid)
        except User.DoesNotExist:
            return Response(
                {"message": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        game_results = OneVsOneGameResult.objects.filter(
            player1=user
        ) | OneVsOneGameResult.objects.filter(player2=user)
        serializer = OneVsOneGameResultSerializer(game_results, many=True)
        return Response(serializer.data)


class TwoVsTwoGameResultsView(APIView):
    def get(self, request, user_uuid):
        try:
            user = User.objects.get(uuid=user_uuid)
        except User.DoesNotExist:
            return Response(
                {"message": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        game_results = TwoVsTwoGameResult.objects.filter(
            Q(team1_player1=user)
            | Q(team1_player2=user)
            | Q(team2_player3=user)
            | Q(team2_player4=user)
        )
        serializer = TwoVsTwoGameResultSerializer(game_results, many=True)
        return Response(serializer.data)


class TournamentGameResultsView(APIView):
    def get(self, request, user_uuid):
        try:
            user = User.objects.get(uuid=user_uuid)
        except User.DoesNotExist:
            return Response(
                {"message": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        game_results = TournamentGameResult.objects.filter(players=user)
        serializer = TournamentGameResultSerializer(game_results, many=True)
        return Response(serializer.data)
