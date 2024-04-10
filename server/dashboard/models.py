from django.db import models
from user.models import User
from room.models import Room


class GameResult(models.Model):
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField()
    type = models.IntegerField()
    difficulty = models.IntegerField()

    class Meta:
        abstract = True


class OneVsOneGameResult(GameResult):
    player1 = models.ForeignKey(
        User,
        related_name="game_results_as_player1",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    player2 = models.ForeignKey(
        User,
        related_name="game_results_as_player2",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    score_player1 = models.IntegerField()
    score_player2 = models.IntegerField()


class TwoVsTwoGameResult(GameResult):
    team1_player1 = models.ForeignKey(
        User,
        related_name="game_results_as_team1_player1",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    team1_player2 = models.ForeignKey(
        User,
        related_name="game_results_as_team1_player2",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    team2_player1 = models.ForeignKey(
        User,
        related_name="game_results_as_team2_player1",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    team2_player2 = models.ForeignKey(
        User,
        related_name="game_results_as_team2_player2",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    score_team1 = models.IntegerField()
    score_team2 = models.IntegerField()


class TournamentGameResult(GameResult):
    winner = models.ForeignKey(
        User,
        related_name="tournament_wins",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    last_opponent = models.ForeignKey(
        User,
        related_name="tournament_losses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    winner_score = models.IntegerField()
    opponent_score = models.IntegerField()
