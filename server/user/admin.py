from django.contrib import admin
from .models import User
import uuid


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("uuid", "id_42", "nickname", "avatar")
    search_fields = ("nickname", "id_42")
    readonly_fields = (
        "uuid",
        "otp_secret",
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs
