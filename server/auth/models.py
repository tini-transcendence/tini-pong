import uuid
from django.db import models


class RefreshToken(models.Model):
    user_uuid = models.UUIDField(default=uuid.uuid4)
    token = models.CharField(db_index=True)
    expiration_time = models.IntegerField()
