FROM python:3.11.4-alpine3.18
LABEL maintainer="tini-pong"

ENV PYTHONUNBUFFERED 1


COPY ./Pipfile /server/Pipfile
COPY ./Pipfile.lock /server/Pipfile.lock
WORKDIR /server
# EXPOSE 8000

ARG DEV=false
RUN apk add --update --no-cache postgresql-client postgresql-dev gcc musl-dev && \
    apk add libffi-dev && \
    pip install pipenv && \
    pipenv install --system --deploy --ignore-pipfile

# EXPOSE 8000

RUN adduser \
        --disabled-password \
        --no-create-home \
        django-user

WORKDIR /server
COPY ./Pipfile ./Pipfile
COPY ./Pipfile.lock ./Pipfile.lock
EXPOSE 8000

RUN apk add --update --no-cache \
    postgresql-client \
    postgresql-dev \
    gcc \
    musl-dev \
    libffi-dev
RUN pip install pipenv && pipenv install --system --deploy --ignore-pipfile

USER django-user
COPY --chown=django-user:django-user ./ ./
