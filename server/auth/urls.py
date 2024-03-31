from django.urls import path

from .views import OauthView, OTPView, RefreshTokenView

urlpatterns = [
    path("oauth/", OauthView.as_view(), name="oauth"),
    path("otp/", OTPView.as_view()),
    path("refresh/", RefreshTokenView.as_view()),
]
