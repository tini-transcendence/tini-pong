from django.urls import path

from .views import LoginOauthView

urlpatterns = [
    path("login/oauth/", LoginOauthView.as_view(), name="oauth"),
]
