from rest_framework import serializers
from .models import Room, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["uuid", "id_42", "otp_secret", "nickname", "avatar"]


class RoomSerializer(serializers.ModelSerializer):
    owner_uuid = UserSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ["uuid", "name", "type", "difficulty", "owner_uuid"]
