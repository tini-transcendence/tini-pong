import uuid
from django.db import models


class User(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_42 = models.CharField(db_index=True)
    otp_secret = models.CharField()
    nickname = models.CharField(max_length=20)
    avatar = models.CharField(null=True)
    online_status = models.DateTimeField(auto_now=True)
