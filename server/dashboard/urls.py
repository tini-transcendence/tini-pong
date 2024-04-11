from django.urls import path
from .views import (
    OneVsOneGameResultList,
    TwoVsTwoGameResultList,
    TournamentGameResultList,
)

urlpatterns = [
    path("1vs1/", OneVsOneGameResultList.as_view(), name="1vs1_game_results"),
    path("2vs2/", TwoVsTwoGameResultList.as_view(), name="2vs2_game_results"),
    path(
        "tournament/",
        TournamentGameResultList.as_view(),
        name="tournament_game_results",
    ),
]
