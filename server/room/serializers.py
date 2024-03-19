from rest_framework import serializers
from .models import Room, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class RoomSerializer(serializers.ModelSerializer):
    owner_uuid = UserSerializer(read_only=True)

    class Meta:
        model = Room
        fields = "__all__"
