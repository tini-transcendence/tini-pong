from rest_framework import serializers
from .models import OneVsOneGameResult, TwoVsTwoGameResult, TournamentGameResult


class OneVsOneGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneVsOneGameResult
        fields = "__all__"


class TwoVsTwoGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwoVsTwoGameResult
        fields = "__all__"


class TournamentGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentGameResult
        fields = "__all__"
