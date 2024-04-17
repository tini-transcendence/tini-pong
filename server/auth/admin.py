from django.contrib import admin
from .models import RefreshToken


@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    list_display = ("user_uuid", "token", "expiration_time")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs
