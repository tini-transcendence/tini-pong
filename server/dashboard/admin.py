from django.contrib import admin
from .models import OneVsOneGameResult, TwoVsTwoGameResult, TournamentGameResult

admin.site.register(OneVsOneGameResult)
admin.site.register(TwoVsTwoGameResult)
admin.site.register(TournamentGameResult)
