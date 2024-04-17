FROM python:3.11.4-alpine3.18
LABEL maintainer="tini-pong"

ENV PYTHONUNBUFFERED 1

RUN adduser \
        --disabled-password \
        --no-create-home \
        django-user

WORKDIR /server
COPY ./Pipfile ./Pipfile
COPY ./Pipfile.lock ./Pipfile.lock

RUN apk add --update --no-cache \
        postgresql-client \
        postgresql-dev \
        gcc \
        musl-dev \
        libffi-dev
RUN pip install pipenv && pipenv install --system --deploy --ignore-pipfile
RUN chown django-user /server

USER django-user
COPY --chown=django-user:django-user ./ ./
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
