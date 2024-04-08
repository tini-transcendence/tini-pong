import uuid
from django.db import models
from user.models import User
from room.models import Room


class GameResult(models.Model):
    start_time = models.DateTimeField()
    win = models.BooleanField()

    class Meta:
        abstract = True


class OneVsOneGameResult(GameResult):
    room = models.ForeignKey(
        Room, on_delete=models.PROTECT, related_name="one_vs_one_game_results"
    )
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player1")
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player2")
    score_player1 = models.IntegerField()
    score_player2 = models.IntegerField()


class TwoVsTwoGameResult(GameResult):
    room = models.ForeignKey(
        Room, on_delete=models.PROTECT, related_name="two_vs_two_game_results"
    )
    team1_player1 = models.ForeignKey(
        User,
        related_name="team1_player1",
        on_delete=models.CASCADE,
    )
    team1_player2 = models.ForeignKey(
        User,
        related_name="team1_player2",
        on_delete=models.CASCADE,
    )
    team2_player3 = models.ForeignKey(
        User,
        related_name="team2_player3",
        on_delete=models.CASCADE,
    )
    team2_player4 = models.ForeignKey(
        User,
        related_name="team2_player4",
        on_delete=models.CASCADE,
    )
    score_team1 = models.IntegerField()
    score_team2 = models.IntegerField()


class TournamentGameResult(GameResult):
    room = models.ForeignKey(
        Room, on_delete=models.PROTECT, related_name="tournament_game_results"
    )
    players = models.ManyToManyField(User, related_name="tournament_results")
    final_scores = models.JSONField()
