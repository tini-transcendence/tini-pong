import json
from http import HTTPStatus

from django.http import HttpRequest, JsonResponse, HttpResponse
from django.views import View
from django.db import IntegrityError

from .models import Friend


class FriendListView(View):
    def get(self, request: HttpRequest):
        friend_list = Friend.objects.filter(
            user_from=request.user_uuid
        ).select_related()
        friend_list_response = []
        for friend in friend_list:
            friend_list_response.append(
                {"uuid": friend.user_to.uuid, "nickname": friend.user_to.nickname}
            )
        return JsonResponse(friend_list_response, safe=False)


class AddFriendView(View):
    def post(self, request: HttpRequest):
        try:
            user_to = json.loads(request.body)["target_uuid"]
            Friend.objects.create(user_from=request.user_uuid, user_to_id=user_to)
            return HttpResponse(status=HTTPStatus.CREATED)
        except IntegrityError:
            return HttpResponse(status=HTTPStatus.CONFLICT)
