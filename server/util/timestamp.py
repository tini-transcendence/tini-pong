import datetime
import pytz


def get_timestamp(days=0, hours=0, minutes=0, seconds=0):
    # TODO: timezone 고려하기!
    timestamp_now = datetime.datetime.now() - datetime.datetime(1970, 1, 1, 9)
    timestamp = timestamp_now + datetime.timedelta(
        days=days, hours=hours, minutes=minutes, seconds=seconds
    )
    return int(timestamp.total_seconds())


def get_django_timestamp(days=0, hours=0, minutes=0, seconds=0):
    timezone = pytz.timezone("Asia/Seoul")
    timestamp_now = datetime.datetime.now(timezone)

    timestamp = timestamp_now + datetime.timedelta(
        days=days, hours=hours, minutes=minutes, seconds=seconds
    )

    return timestamp.isoformat()
