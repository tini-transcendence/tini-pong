from django.http import HttpRequest

from util.jwt import validate, decode
import os


class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        access_token = request.COOKIES["access_token"]
        try:
            request.is_logged_in = validate(
                access_token, os.environ.get("ACCESS_SECRET")
            )
            if request.is_logged_in == True:
                request.user_uuid = decode(access_token).get("uuid")
        except:
            request.is_logged_in = False
        response = self.get_response(request)
        return response
