from django.http import HttpRequest, HttpResponse
from django.conf import settings

from util.jwt import validate, decode
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


def check_whitelist(request_path):
    for path in settings.AUTH_WHITELIST:
        if request_path.startswith(path):
            return True
    return False
