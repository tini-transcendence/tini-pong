import uuid
from django.db import models
from user.models import User


# Create your models here.


class TournamentHistory(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    play_time = models.DateTimeField()
    user1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tournament_histories_user1"
    )
    user2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tournament_histories_user2"
    )
    user3 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tournament_histories_user3"
    )
    user4 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tournament_histories_user4"
    )
    win_user = models.CharField(max_length=255)


class WinLoseHistory(models.Model):
    auto_increment = models.AutoField(primary_key=True)
    user_uuid = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="win_lose_histories"
    )
    game_count = models.IntegerField(default=0)
    victory_count = models.IntegerField(default=0)
    defeat_count = models.IntegerField(default=0)


class OneVsOneHistory(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    play_time = models.DateTimeField()
    user1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="one_vs_one_histories_user1"
    )
    user2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="one_vs_one_histories_user2"
    )
    win_user = models.CharField(max_length=255)
