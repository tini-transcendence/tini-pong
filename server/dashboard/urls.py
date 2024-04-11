from django.urls import path
from .views import (
    TournamentGameResultList,
)

urlpatterns = [
    path(
        "tournament/",
        TournamentGameResultList.as_view(),
        name="tournament_game_results",
    ),
]
