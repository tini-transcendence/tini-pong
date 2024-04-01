from django.urls import path

from .views import UserProfileView, LoginOauthView, StatusUpdateView

urlpatterns = [
    path("profile/", UserProfileView.as_view()),
    path("status-update/", StatusUpdateView.as_view()),
    path("login/oauth/", LoginOauthView.as_view(), name="oauth"),
]
