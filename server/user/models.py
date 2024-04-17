import uuid
from django.db import models


class User(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_42 = models.CharField(db_index=True)
    otp_secret = models.CharField()
    nickname = models.CharField(max_length=20, db_index=True)
    avatar = models.CharField(null=True)
    message = models.CharField(max_length=100, default="")
    online_status = models.DateTimeField(auto_now=True)
    has_logged_in = models.BooleanField(default=False)
    game_results = models.ManyToManyField("GameResult", related_name="users")

    def __str__(self):
        return self.nickname


class GameResult(models.Model):
    start_time = models.DateTimeField()
    player1 = models.ForeignKey(
        User,
        related_name="game_results_as_player1",
        on_delete=models.SET_NULL,
        null=True,
    )
    player2 = models.ForeignKey(
        User,
        related_name="game_results_as_player2",
        on_delete=models.SET_NULL,
        null=True,
    )
    player3 = models.ForeignKey(
        User,
        related_name="game_results_as_player3",
        on_delete=models.SET_NULL,
        null=True,
    )
    player4 = models.ForeignKey(
        User,
        related_name="game_results_as_player4",
        on_delete=models.SET_NULL,
        null=True,
    )
    type = models.IntegerField()
    difficulty = models.IntegerField()
    score = models.CharField()
    win = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
