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
    players = models.ManyToManyField("User", related_name="game_result")
    type = models.IntegerField()
    difficulty = models.IntegerField()
    score = models.CharField()
    win = models.IntegerField(default=0)
