from rest_framework import serializers
from .models import User, TournamentHistory, WinLoseHistory, OneVsOneHistory


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class TournamentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentHistory
        fields = "__all__"


class WinLoseHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WinLoseHistory
        fields = "__all__"


class OneVsOneHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OneVsOneHistory
        fields = "__all__"
