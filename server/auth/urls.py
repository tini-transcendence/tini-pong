from django.urls import path

from .views import RefreshTokenView

urlpatterns = [path("refresh", RefreshTokenView.as_view())]
