from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from user.models import User
from util.jwt import validate, decode, BaseJWTError
from django.http import HttpRequest, HttpResponse
from django.conf import settings

import os
from http import HTTPStatus


class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        try:
            access_token = request.COOKIES["access_token"]
            request.is_logged_in = validate(
                access_token, os.environ.get("ACCESS_SECRET")
            )
            if request.is_logged_in == True:
                request.user_uuid = decode(access_token).get("uuid")
        except:
            request.is_logged_in = False
        if not request.is_logged_in and not check_whitelist(request.path):
            return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
        response = self.get_response(request)
        return response



class TokenAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        query_string = scope.get("query_string", "").decode("utf-8")
        params = dict(x.split("=") for x in query_string.split("&") if "=" in x)
        token = params.get("access_token", None)

        if token:
            try:
                is_valid = validate(token, os.environ.get("ACCESS_SECRET"))
                if is_valid:
                    user_uuid = decode(token).get("uuid")
                    scope["user"] = await self.get_user(user_uuid)
                else:
                    scope["user"] = AnonymousUser()
            except BaseJWTError:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_uuid):
        try:
            return User.objects.get(uuid=user_uuid)
        except User.DoesNotExist:
            return AnonymousUser()


def check_whitelist(request_path):
    for path in settings.AUTH_WHITELIST:
        if request_path.startswith(path):
            return True
    return False

