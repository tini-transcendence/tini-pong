from django.http import HttpRequest, JsonResponse
from django.views import View

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
