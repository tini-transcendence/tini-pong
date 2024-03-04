FROM python:3.11.4-alpine3.18
LABEL maintainer="tini-pong"

ENV PYTHONUNBUFFERED 1

COPY ./Pipfile /server/Pipfile
COPY ./Pipfile.lock /server/Pipfile.lock
WORKDIR /server
EXPOSE 8000

ARG DEV=false
RUN apk add --update --no-cache postgresql-client postgresql-dev gcc musl-dev && \
    pip install pipenv && \
    pipenv install --system --deploy --ignore-pipfile && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

COPY ./ /server

ENV PATH="/py/bin:$PATH"

USER django-user