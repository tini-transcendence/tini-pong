from django.db import models
from room.models import Room


class GameResult(models.Model):
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField()
    type = models.IntegerField()
    difficulty = models.IntegerField()

    class Meta:
        abstract = True


class OneVsOneGameResult(GameResult):
    player1_nickname = models.CharField(max_length=20, null=True, blank=True)
    player1_avatar = models.CharField(null=True)
    player2_nickname = models.CharField(max_length=20, null=True, blank=True)
    player2_avatar = models.CharField(null=True)
    score_player1 = models.IntegerField()
    score_player2 = models.IntegerField()


class TwoVsTwoGameResult(GameResult):
    team1_player1_nickname = models.CharField(max_length=20, null=True, blank=True)
    team1_player1_avatar = models.CharField(null=True)
    team1_player2_nickname = models.CharField(max_length=20, null=True, blank=True)
    team1_player2_avatar = models.CharField(null=True)
    team2_player1_nickname = models.CharField(max_length=20, null=True, blank=True)
    team2_player1_avatar = models.CharField(null=True)
    team2_player2_nickname = models.CharField(max_length=20, null=True, blank=True)
    team2_player2_avatar = models.CharField(null=True)
    score_team1 = models.IntegerField()
    score_team2 = models.IntegerField()
