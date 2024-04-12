import json
from http import HTTPStatus

from django.http import JsonResponse, HttpRequest, HttpResponseBadRequest, HttpResponse
from django.views import View
from django.db import IntegrityError
from django.db.models import Q
from .models import User, GameResult
from util.sanitize import sanitize, sanitize_tag
from django.core.exceptions import ObjectDoesNotExist


class UserProfileView(View):
    def get(self, request: HttpRequest):
        try:
            user_uuid = request.GET.get("uuid", request.user_uuid)
            user = User.objects.get(pk=user_uuid)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest()

        game_results = GameResult.objects.filter(
            Q(player1=user) | Q(player2=user) | Q(player3=user) | Q(player4=user)
        ).distinct()

        game_history = []
        for game_result in game_results:
            players = []
            for player_num in range(1, 5):
                player = getattr(game_result, f"player{player_num}", None)
                if player:
                    players.append(
                        {
                            "uuid": player.uuid,
                            "nickname": player.nickname,
                        }
                    )
            game_history.append(
                {
                    "type": game_result.type,
                    "difficulty": game_result.difficulty,
                    "score": game_result.score,
                    "win": game_result.win,
                    "start_time": game_result.start_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "players": players,
                }
            )

        return JsonResponse(
            {
                "nickname": user.nickname,
                "avatar": user.avatar,
                "message": user.message,
                "uuid": user_uuid,
                "id_tag": str(user_uuid)[:4],
                "self": user_uuid == request.user_uuid,
                "game_history": game_history,
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
