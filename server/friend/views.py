import json
from http import HTTPStatus
from operator import attrgetter
from datetime import datetime, timedelta, timezone

from django.http import HttpRequest, JsonResponse, HttpResponse, HttpResponseBadRequest
from django.views import View
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from .models import Friend
from user.models import User


class FriendListView(View):
    def get(self, request: HttpRequest):
        friend_list = Friend.objects.filter(
            user_from=request.user_uuid
        ).select_related()
        response_list = []
        for friend in friend_list:
            uuid, nickname, avatar = attrgetter("uuid", "nickname", "avatar")(
                friend.user_to
            )
            status = calculate_online_status(friend.user_to.online_status)
            response_list.append(
                {"uuid": uuid, "nickname": nickname, "avatar": avatar, "status": status}
            )
        return JsonResponse(response_list, safe=False)


class AddFriendView(View):
    def post(self, request: HttpRequest):
        try:
            user_to = json.loads(request.body)["target_uuid"]
            if request.user_uuid == str(user_to):
                return HttpResponseBadRequest()
            Friend.objects.create(user_from=request.user_uuid, user_to_id=user_to)
            return HttpResponse(status=HTTPStatus.CREATED)
        except IntegrityError:
            return HttpResponse(status=HTTPStatus.CONFLICT)
        except ValidationError:
            return HttpResponseBadRequest()


class DeleteFriendView(View):
    def delete(self, request: HttpRequest):
        try:
            user_to = json.loads(request.body)["target_uuid"]
            if request.user_uuid == str(user_to):
                return HttpResponseBadRequest()
            Friend.objects.get(user_from=request.user_uuid, user_to_id=user_to).delete()
            return HttpResponse()
        except Friend.DoesNotExist:
            return HttpResponse(status=HTTPStatus.NO_CONTENT)
        except ValidationError:
            return HttpResponseBadRequest()


class SearchFriendView(View):
    def get(self, request: HttpRequest):
        target_nickname = request.GET.get("nickname")
        searched_users = User.objects.filter(nickname=target_nickname)
        response_list = []
        for user in searched_users:
            uuid, nickname, avatar = attrgetter("uuid", "nickname", "avatar")(user)
            if request.user_uuid == str(uuid):
                continue
            status = calculate_online_status(user.online_status)
            response_list.append(
                {
                    "uuid": uuid,
                    "nickname": nickname,
                    "avatar": avatar,
                    "id_tag": str(uuid)[:4],
                    "status": status,
                }
            )
        return JsonResponse(response_list, safe=False)


def calculate_online_status(online_status: datetime):
    return online_status + timedelta(seconds=35) > datetime.now(tz=timezone.utc)
