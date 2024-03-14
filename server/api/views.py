from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from .models import Room, OneVsOneHistory, User
import json
from django.utils import timezone
from django.http import JsonResponse
from django.views import View
from .models import Room
from django.shortcuts import render


class RoomListView(View):
    def get(self, request, *args, **kwargs):
        rooms = Room.objects.all()
        return render(request, "rooms_list.html", {"rooms": rooms})


def rooms(request):
    if request.method == "GET":
        rooms = Room.objects.all()
        rooms_data = [
            {"name": room.name, "type": room.type, "difficulty": room.difficulty}
            for room in rooms
        ]
        return JsonResponse({"rooms": rooms_data})
    else:
        return HttpResponse("Method Not Allowed", status=405)


# Room 생성
from django.shortcuts import redirect


@csrf_exempt
def create_room(request):
    if request.method == "POST":
        try:
            owner = User.objects.get(uuid=request.POST.get("owner_uuid"))
            room = Room.objects.create(
                name=request.POST.get("name"),
                type=request.POST.get("type"),
                difficulty=request.POST.get("difficulty"),
                owner_uuid=owner,
            )
            return redirect("rooms_list")
        except User.DoesNotExist:
            return JsonResponse({"error": "Owner not found"}, status=404)
    else:
        return HttpResponse("Method Not Allowed", status=405)


# Room 삭제
@csrf_exempt
def delete_room(request, uuid):
    if request.method == "DELETE":
        try:
            room = Room.objects.get(uuid=uuid)
            room.delete()
            return JsonResponse({"message": "Room deleted successfully"}, status=200)
        except ObjectDoesNotExist:
            return JsonResponse({"message": "Room not found"}, status=404)
    else:
        return HttpResponse("Method Not Allowed", status=405)


# OneVsOneHistory 생성
@csrf_exempt
def create_match(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user1 = User.objects.get(uuid=data["user1_uuid"])
            user2 = User.objects.get(uuid=data["user2_uuid"])
            win_user_uuid = data.get("win_user")
            win_user = user1.uuid if win_user_uuid == str(user1.uuid) else user2.uuid
            match = OneVsOneHistory.objects.create(
                uuid=data["uuid"],
                play_time=timezone.now(),
                user1=user1,
                user2=user2,
                win_user=win_user,
            )
            return JsonResponse(
                {
                    "message": "Match created successfully",
                    "match_uuid": str(match.uuid),
                },
                status=201,
            )
        except KeyError as e:
            return JsonResponse({"error": f"Missing data: {e}"}, status=400)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    else:
        return HttpResponse("Method Not Allowed", status=405)
