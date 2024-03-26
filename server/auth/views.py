import os

from django.http import HttpRequest, HttpResponse
from django.views import View

from http import HTTPStatus

from util.jwt import create, validate
from util.timestamp import get_timestamp

from .models import RefreshToken


class RefreshTokenView(View):
    def post(self, request: HttpRequest):
        user = None
        try:
            received_token = request.POST["refresh_token"]
            searched_token = RefreshToken.objects.get(token=received_token)
            if validate(received_token, os.environ.get("REFRESH_SECRET")) != True:
                searched_token.delete()
                return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
            user = searched_token.user_uuid
        except:
            return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
        access_token = create(
            {"uuid": str(user)},
            os.environ.get("ACCESS_SECRET"),
            get_timestamp(minutes=30),
        )
        response = HttpResponse()
        response.set_cookie(key="access_token", value=access_token, secure=True, samesite='None')
        return response
