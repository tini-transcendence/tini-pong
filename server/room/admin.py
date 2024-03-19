from django.contrib import admin
from .models import Room
import uuid


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("uuid", "name", "type", "difficulty", "owner_uuid")
    list_filter = ("type", "difficulty", "owner_uuid")
    search_fields = (
        "name",
        "owner_uuid__username",
    )  # User 모델의 username 필드를 검색 대상으로 설정
    readonly_fields = ("uuid",)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs
