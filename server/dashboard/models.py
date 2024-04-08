import uuid
from django.db import models
from user.models import User
from room.models import Room


# Create your models here.
class GameResult(models.Model):
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="game_results"
    )
    start_time = models.DateTimeField()
    win = models.BooleanField()

    class Meta:
        abstract = True


class OneVsOneGameResult(GameResult):
    player1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="one_v_one_results_as_player1"
    )
    player2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="one_v_one_results_as_player2"
    )
    score_player1 = models.IntegerField()
    score_player2 = models.IntegerField()


class TwoVsTwoGameResult(GameResult):
    team1_player1 = models.ForeignKey(
        User,
        related_name="two_v_two_results_as_team1_player1",
        on_delete=models.CASCADE,
    )
    team1_player2 = models.ForeignKey(
        User,
        related_name="two_v_two_results_as_team1_player2",
        on_delete=models.CASCADE,
    )
    team2_player3 = models.ForeignKey(
        User,
        related_name="two_v_two_results_as_team2_player1",
        on_delete=models.CASCADE,
    )
    team2_player4 = models.ForeignKey(
        User,
        related_name="two_v_two_results_as_team2_player2",
        on_delete=models.CASCADE,
    )
    score_team1 = models.IntegerField()
    score_team2 = models.IntegerField()


class TournamentGameResult(GameResult):
    players = models.ManyToManyField(User, related_name="tournament_results")
    final_scores = models.JSONField()
