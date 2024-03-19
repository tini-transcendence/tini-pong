from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Room
from .serializers import RoomSerializer
import json
from django.utils import timezone

# Create your views here.


class RoomListView(APIView):
    def get(self, request, *args, **kwargs):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response({"rooms": serializer.data})


@method_decorator(csrf_exempt, name="dispatch")
class CreateRoomView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            owner = User.objects.get(uuid=request.data.get("owner_uuid"))
            room = Room.objects.create(
                name=request.data.get("name"),
                type=request.data.get("type"),
                difficulty=request.data.get("difficulty"),
                owner_uuid=owner,
            )
            return Response(
                {"message": "Room created successfully"}, status=status.HTTP_201_CREATED
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Owner not found"}, status=status.HTTP_404_NOT_FOUND
            )


@method_decorator(csrf_exempt, name="dispatch")
class DeleteRoomView(APIView):
    def delete(self, request, uuid, *args, **kwargs):
        try:
            room = Room.objects.get(uuid=uuid)
            room.delete()
            return Response(
                {"message": "Room deleted successfully"}, status=status.HTTP_200_OK
            )
        except Room.DoesNotExist:
            return Response(
                {"message": "Room not found"}, status=status.HTTP_404_NOT_FOUND
            )
