from django.urls import path

from .views import LoginOauthView, StatusUpdateView

urlpatterns = [
    path("status-update/", StatusUpdateView.as_view()),
    path("login/oauth/", LoginOauthView.as_view(), name="oauth"),
]
