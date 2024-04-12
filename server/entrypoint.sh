#!/bin/sh
python manage.py wait_for_db
python manage.py migrate

celery -A server worker -l info & \
celery -A server beat -l info & \
python manage.py runserver 0.0.0.0:9000
