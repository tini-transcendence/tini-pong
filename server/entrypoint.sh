#!/bin/sh
mkdir -p ./var/log/celery

python manage.py wait_for_db
python manage.py migrate

celery -A server worker -l info --logfile ./var/log/celery/worker.log & \
celery -A server beat -l info --logfile ./var/log/celery/beat.log & \
python manage.py runserver 0.0.0.0:9000
