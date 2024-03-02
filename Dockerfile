FROM python:3.11.4-alpine3.18
LABEL maintainer="tini-pong"

ENV PYTHONUNBUFFERED 1

COPY ./Pipfile /Pipfile
COPY ./Pipfile.lock /Pipfile.lock
COPY ./server /server
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

ENV PATH="/py/bin:$PATH"

USER django-user
