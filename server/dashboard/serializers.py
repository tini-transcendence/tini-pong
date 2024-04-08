from rest_framework import serializers
from .models import OneVsOneGameResult, TwoVsTwoGameResult, TournamentGameResult


class OneVsOneGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneVsOneGameResult
        fields = [
            "win",
            "start_time",
            "player1",
            "player2",
            "score_player1",
            "score_player2",
        ]


class TwoVsTwoGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwoVsTwoGameResult
        fields = [
            "win",
            "start_time",
            "team1_player1",
            "team1_player2",
            "team2_player1",
            "team2_player2",
            "score_team1",
            "score_team2",
        ]


class TournamentGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentGameResult
        fields = [
            "win",
            "start_time",
            "players",
            "final_scores",
        ]
