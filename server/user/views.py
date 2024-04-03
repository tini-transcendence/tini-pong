import requests
import os
import json
from http import HTTPStatus

from django.http import JsonResponse, HttpRequest, HttpResponseBadRequest, HttpResponse
from django.views import View
from django.db import IntegrityError

from .models import User
from auth.models import RefreshToken

from util.jwt import create
from util.timestamp import get_timestamp


class UserProfileView(View):
    def get(self, request: HttpRequest):
        try:
            user_uuid = request.GET.get("uuid")
            user = User.objects.get(pk=user_uuid)
        except:
            return HttpResponseBadRequest()
        return JsonResponse(
            {
                "nickname": user.nickname,
                "avatar": user.avatar,
                "self": user_uuid == request.user_uuid,
            }
        )


class EditUserView(View):
    def post(self, request: HttpRequest):
        try:
            new_info = json.loads(request.body)
        except:
            return HttpResponseBadRequest()
        new_info_filtered = {}
        if "nickname" in new_info:
            new_info_filtered["nickname"] = new_info["nickname"]
        if "avatar" in new_info:
            new_info_filtered["avatar"] = new_info["avatar"]
        if "message" in new_info:
            new_info_filtered["message"] = new_info["message"]
        if len(new_info_filtered) == 0:
            return HttpResponseBadRequest()
        user = User.objects.get(pk=request.user_uuid)
        for key, value in new_info_filtered.items():
            setattr(user, key, value)
        try:
            user.save(update_fields=list(new_info_filtered.keys()))
        except IntegrityError:
            return HttpResponseBadRequest()
        return HttpResponse(status=HTTPStatus.CREATED)


class StatusUpdateView(View):
    def post(self, request: HttpRequest):
        User.objects.get(pk=request.user_uuid).save(update_fields=["online_status"])
        return HttpResponse()


class LoginOauthView(View):
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
            defaults={"otp_secret": "otp_secret", "nickname": user_42_logged_in},
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
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="None",
        )
        return response
