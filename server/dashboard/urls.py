from django.urls import path
from .views import (
    OneVsOneGameResultsView,
    TwoVsTwoGameResultsView,
    TournamentGameResultsView,
)

urlpatterns = [
    path(
        "user/<uuid:user_uuid>/results/1v1/",
        OneVsOneGameResultsView.as_view(),
        name="one-vs-one-game-results",
    ),
    path(
        "user/<uuid:user_uuid>/results/2v2/",
        TwoVsTwoGameResultsView.as_view(),
        name="two-vs-two-game-results",
    ),
    path(
        "user/<uuid:user_uuid>/results/tournament/",
        TournamentGameResultsView.as_view(),
        name="tournament-game-results",
    ),
]
