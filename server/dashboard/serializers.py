from rest_framework import serializers
from .models import OneVsOneGameResult, TwoVsTwoGameResult


class OneVsOneGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneVsOneGameResult
        fields = "__all__"


class TwoVsTwoGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwoVsTwoGameResult
        fields = "__all__"
