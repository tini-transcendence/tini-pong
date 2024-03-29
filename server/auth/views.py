import requests
import os
import json
from http import HTTPStatus

from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View

from .models import RefreshToken
from user.models import User

from util.jwt import create, validate
from util.timestamp import get_timestamp
from pyotp import random_base32, totp


class OauthView(View):
    def get(self, request: HttpRequest):
        oauth_response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": os.environ.get("OAUTH_UID"),
                "client_secret": os.environ.get("OAUTH_SECRET"),
                "code": request.GET.get("code"),
                "redirect_uri": os.environ.get("OAUTH_REDIRECT_URI"),
            },
        )
        if oauth_response.status_code != 200:
            return HttpResponseBadRequest()
        profile_response = requests.get(
            "https://api.intra.42.fr/v2/me",
            headers={
                "Authorization": "Bearer %s" % oauth_response.json().get("access_token")
            },
        )
        if profile_response.status_code != 200:
            return HttpResponseBadRequest()
        user_42_logged_in = profile_response.json().get("login")
        (user_logged_in, created) = User.objects.get_or_create(
            id_42=user_42_logged_in,
            defaults={"otp_secret": random_base32(), "nickname": user_42_logged_in},
        )
        access_token = create(
            {"uuid": str(user_logged_in.uuid)},
            os.environ.get("ACCESS_SECRET"),
            get_timestamp(minutes=30),
        )
        refresh_token_exp = get_timestamp(days=14)
        refresh_token = create(
            {},
            os.environ.get("REFRESH_SECRET"),
            refresh_token_exp,
        )
        RefreshToken.objects.create(
            user_uuid=user_logged_in.uuid,
            token=refresh_token,
            expiration_time=refresh_token_exp,
        )
        response = JsonResponse({"refresh_token": refresh_token})
        response.set_cookie(
            key="access_token", value=access_token, secure=True, samesite="None"
        )
        return response


class OTPView(View):
    def post(self, request: HttpRequest):
        request_body = json.loads(request.body)
        user_uuid = request_body["user_uuid"]
        otp_code = request_body["otp_code"]
        try:
            user = User.objects.get(pk=user_uuid)
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        if not totp.TOTP(user.otp_secret).verify(otp_code):
            return HttpResponseBadRequest()
        access_token = create(
            {"uuid": str(user.uuid)},
            os.environ.get("ACCESS_SECRET"),
            get_timestamp(minutes=30),
        )
        refresh_token_exp = get_timestamp(days=14)
        refresh_token = create(
            {},
            os.environ.get("REFRESH_SECRET"),
            refresh_token_exp,
        )
        RefreshToken.objects.create(
            user_uuid=user.uuid,
            token=refresh_token,
            expiration_time=refresh_token_exp,
        )
        response = JsonResponse({"refresh_token": refresh_token})
        response.set_cookie(
            key="access_token", value=access_token, secure=True, samesite="None"
        )
        return response


class RefreshTokenView(View):
    def post(self, request: HttpRequest):
        user = None
        try:
            received_token = json.loads(request.body)["refresh_token"]
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
        response.set_cookie(
            key="access_token", value=access_token, secure=True, samesite="None"
        )
        return response
