import json
from http import HTTPStatus
from operator import attrgetter

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
        friend_list_response = []
        for friend in friend_list:
            uuid, nickname = attrgetter("uuid", "nickname")(friend.user_to)
            friend_list_response.append({"uuid": uuid, "nickname": nickname})
        return JsonResponse(friend_list_response, safe=False)


class AddFriendView(View):
    def post(self, request: HttpRequest):
        try:
            user_to = json.loads(request.body)["target_uuid"]
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
            Friend.objects.get(user_from=request.user_uuid, user_to_id=user_to).delete()
            return HttpResponse()
        except Friend.DoesNotExist:
            return HttpResponse(status=HTTPStatus.NO_CONTENT)
        except ValidationError:
            return HttpResponseBadRequest()


class SearchFriendView(View):
    def get(self, request: HttpRequest):
        try:
            target_nickname = request.GET.get("nickname")
            searched_user = User.objects.get(nickname=target_nickname)
            uuid, nickname = attrgetter("uuid", "nickname")(searched_user)
            if request.user_uuid == str(uuid):
                return HttpResponseBadRequest()
            return JsonResponse({"uuid": uuid, "nickname": nickname})
        except User.DoesNotExist:
            return JsonResponse({})
