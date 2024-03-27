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
from blockchain.executeFunction import retrieve_transaction, store_transaction
import time


class DashBoardView(APIView):
    def get(self, request):
        json_data = json.loads(retrieve_transaction())

        return Response(json_data)

    # def get(self, request, uuid, format=None):
    #    user = User.objects.get(uuid=uuid)
    #    user_data = UserSerializer(user).data

    #    tournament_histories = (
    #        TournamentHistory.objects.filter(user1=user)
    #        | TournamentHistory.objects.filter(user2=user)
    #        | TournamentHistory.objects.filter(user3=user)
    #        | TournamentHistory.objects.filter(user4=user)
    #    )
    #    win_lose_histories = WinLoseHistory.objects.filter(user_uuid=user)
    #    one_vs_one_histories = OneVsOneHistory.objects.filter(
    #        user1=user
    #    ) | OneVsOneHistory.objects.filter(user2=user)

    #    user_data["tournament_histories"] = TournamentHistorySerializer(
    #        tournament_histories, many=True
    #    ).data
    #    user_data["win_lose_histories"] = WinLoseHistorySerializer(
    #        win_lose_histories, many=True
    #    ).data
    #    user_data["one_vs_one_histories"] = OneVsOneHistorySerializer(
    #        one_vs_one_histories, many=True
    #    ).data

    #    return Response(user_data)


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


# retrieve_transaction()
def test():
    t = Tournament()
    t.add_timestamp()
    t.add_game_log(t.make_player("test player A", 1), t.make_player("b", 0), 1)
    t.add_game_log(t.make_player("test player B", 2), t.make_player("b", 1), 2)
    t.add_game_log(t.make_player("test player A", 3), t.make_player("b", 2), 3)

    store_transaction(t.tournament)


class StoreTransactionView(APIView):
    def get(self, request):
        test()
        return Response("Data Saved")
