from .models import RefreshToken

from celery import shared_task
from util.timestamp import get_timestamp


@shared_task
def delete_expired_token():
    RefreshToken.objects.filter(expiration_time__lt=get_timestamp()).delete()
