import datetime


def get_timestamp(days=0, hours=0, minutes=0, seconds=0):
    # TODO: timezone 고려하기!
    timestamp_now = datetime.datetime.now() - datetime.datetime(1970, 1, 1, 9)
    timestamp = timestamp_now + datetime.timedelta(
        days=days, hours=hours, minutes=minutes, seconds=seconds
    )
    return int(timestamp.total_seconds())
