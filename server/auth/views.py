import requests
import os
import json
from http import HTTPStatus

from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View

from .models import RefreshToken
from user.models import User

from util.jwt import create, validate, decode
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
        oauth_token = create(
            {"uuid": str(user_logged_in.uuid)},
            os.environ.get("FIRST_FACTOR_SECRET"),
            get_timestamp(minutes=10),
        )
        response = JsonResponse({"has_logged_in": user_logged_in.has_logged_in})
        response.set_cookie(
            key="oauth_token", value=oauth_token, secure=True, samesite="None"
        )
        return response


class OTPView(View):
    def get(self, request: HttpRequest):
        try:
            oauth_token = request.COOKIES["oauth_token"]
            if not validate(oauth_token, os.environ.get("FIRST_FACTOR_SECRET")):
                return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
        except:
            return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
        user_uuid = decode(oauth_token)["uuid"]
        user = User.objects.get(pk=user_uuid)
        totp_uri = totp.TOTP(user.otp_secret).provisioning_uri(
            name=user.id_42, issuer_name="TINY_PONG"
        )
        return JsonResponse({"otp_uri": totp_uri})

    def post(self, request: HttpRequest):
        try:
            oauth_token = request.COOKIES["oauth_token"]
            if not validate(oauth_token, os.environ.get("FIRST_FACTOR_SECRET")):
                return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
        except:
            return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
        request_body = json.loads(request.body)
        user_uuid = decode(oauth_token)["uuid"]
        otp_code = request_body["otp_code"]
        try:
            user = User.objects.get(pk=user_uuid)
        except User.DoesNotExist:
            return HttpResponseBadRequest()
        if not totp.TOTP(user.otp_secret).verify(otp_code):
            return HttpResponseBadRequest()
        user.has_logged_in = True
        user.save()
        access_token = create_access_token(str(user.uuid))
        refresh_token = create_refresh_token()
        RefreshToken.objects.create(
            user_uuid=user.uuid,
            token=refresh_token,
            expiration_time=decode(refresh_token)["exp"],
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
        access_token = create_access_token(str(user))
        response = HttpResponse()
        response.set_cookie(
            key="access_token", value=access_token, secure=True, samesite="None"
        )
        return response


def create_access_token(uuid: str):
    access_token = create(
        {"uuid": uuid},
        os.environ.get("ACCESS_SECRET"),
        get_timestamp(minutes=30),
    )
    return access_token


def create_refresh_token():
    refresh_token = create(
        {},
        os.environ.get("REFRESH_SECRET"),
        get_timestamp(days=14),
    )
    return refresh_token
