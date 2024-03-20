import requests
import os

from django.http import JsonResponse, HttpRequest, HttpResponseBadRequest
from django.views import View
from django.urls import reverse

from util.jwt import create
from util.timestamp import get_timestamp

from .models import User


class LoginOauthView(View):
    def get(self, request: HttpRequest):
        oauth_response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": os.environ.get("OAUTH_UID"),
                "client_secret": os.environ.get("OAUTH_SECRET"),
                "code": request.GET.get("code"),
                "redirect_uri": (
                    os.environ.get("DOMAIN_NAME") + reverse("oauth").rstrip("/")
                ),
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
        refresh_token = create(
            {"uuid": str(user_logged_in.uuid)},
            os.environ.get("REFRESH_SECRET"),
            get_timestamp(days=14),
        )
        return JsonResponse(
            {"access_token": access_token, "refresh_token": refresh_token}
        )
