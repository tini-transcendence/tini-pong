from django.contrib import admin
from .models import Room
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("uuid", "name", "type", "difficulty", "owner_uuid", "start_time")
    list_filter = ("type", "difficulty", "owner_uuid")
    search_fields = (
        "name",
        "owner_uuid__username",
    )
    readonly_fields = ("uuid", "start_time")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs
