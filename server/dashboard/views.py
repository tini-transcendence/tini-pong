from rest_framework import generics
from .models import OneVsOneGameResult, TwoVsTwoGameResult, TournamentGameResult
from .serializers import (
    OneVsOneGameResultSerializer,
    TwoVsTwoGameResultSerializer,
    TournamentGameResultSerializer,
)


class OneVsOneGameResultList(generics.ListAPIView):
    queryset = OneVsOneGameResult.objects.all()
    serializer_class = OneVsOneGameResultSerializer


class TwoVsTwoGameResultList(generics.ListAPIView):
    queryset = TwoVsTwoGameResult.objects.all()
    serializer_class = TwoVsTwoGameResultSerializer


class TournamentGameResultList(generics.ListAPIView):
    queryset = TournamentGameResult.objects.all()
    serializer_class = TournamentGameResultSerializer
