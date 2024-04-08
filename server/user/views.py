import json
from http import HTTPStatus

from django.http import JsonResponse, HttpRequest, HttpResponseBadRequest, HttpResponse
from django.views import View
from django.db import IntegrityError

from .models import User

from util.sanitize import sanitize, sanitize_tag


class UserProfileView(View):
    def get(self, request: HttpRequest):
        try:
            user_uuid = request.GET["uuid"]
        except:
            user_uuid = request.user_uuid
        try:
            user = User.objects.get(pk=user_uuid)
        except:
            return HttpResponseBadRequest()
        return JsonResponse(
            {
                "nickname": user.nickname,
                "avatar": user.avatar,
                "message": user.message,
                "id_tag": str(user_uuid)[:4],
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
            new_info_filtered["nickname"] = sanitize(new_info["nickname"])
        if "avatar" in new_info:
            new_info_filtered["avatar"] = sanitize_tag(new_info["avatar"])
        if "message" in new_info:
            new_info_filtered["message"] = sanitize(new_info["message"])
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
