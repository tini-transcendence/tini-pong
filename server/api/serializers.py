from rest_framework import serializers
from .models import Room, User, TournamentHistory, WinLoseHistory, OneVsOneHistory


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["uuid", "id_42", "otp_secret", "nickname", "avatar"]


class RoomSerializer(serializers.ModelSerializer):
    owner_uuid = UserSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ["uuid", "name", "type", "difficulty", "owner_uuid"]


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
