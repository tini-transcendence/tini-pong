from rest_framework import generics
from .models import OneVsOneGameResult, TwoVsTwoGameResult
from .serializers import (
    OneVsOneGameResultSerializer,
    TwoVsTwoGameResultSerializer,
)
from blockchain.executeFunction import retrieve_transaction, store_transaction
import time, json
from rest_framework.response import Response
from rest_framework.views import APIView

class OneVsOneGameResultList(generics.ListAPIView):
    queryset = OneVsOneGameResult.objects.all()
    serializer_class = OneVsOneGameResultSerializer


class TwoVsTwoGameResultList(generics.ListAPIView):
    queryset = TwoVsTwoGameResult.objects.all()
    serializer_class = TwoVsTwoGameResultSerializer


class TournamentGameResultList(APIView):
    def get(self, request):
        json_data = json.loads(retrieve_transaction())
        return Response(json_data)


class Tournament:
    def __init__(self):
        self.tournament = []

    @staticmethod
    def make_player(name, score):
        return {"name": name, "score": score}

    def add_game_log(self, playerA, playerB, index):
        self.tournament.append({"index": index, "playerA": playerA, "playerB": playerB})

    def add_timestamp(self):
        self.tournament.append(int(time.time()))
