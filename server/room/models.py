import uuid
from django.db import models
from user.models import User

# Create your models here.


class Room(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.IntegerField()
    difficulty = models.IntegerField()
    owner_uuid = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_rooms"
    )
    is_active = models.BooleanField(default=False)
    max_players = models.IntegerField(default=4)

    def is_full(self):
        return self.room_users.count() >= self.max_players


class RoomUser(models.Model):
    user_uuid = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="room_users"
    )
    room_uuid = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="room_users"
    )
    is_ready = models.BooleanField(default=False)
    player_number = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = [["room_uuid", "player_number"]]
