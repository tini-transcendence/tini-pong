import uuid
from django.db import models


class Friend(models.Model):
    user_from = models.UUIDField(default=uuid.uuid4)
    user_to = models.ForeignKey("user.User", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user_from", "user_to"],
                name="friend_relation",
            )
        ]
