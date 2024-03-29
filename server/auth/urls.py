from django.urls import path

from .views import OauthView, RefreshTokenView

urlpatterns = [
    path("oauth/", OauthView.as_view(), name="oauth"),
    path("refresh/", RefreshTokenView.as_view()),
]
