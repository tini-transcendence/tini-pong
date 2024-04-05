from django.urls import path

from .views import UserProfileView, EditUserView, StatusUpdateView

urlpatterns = [
    path("profile/", UserProfileView.as_view()),
    path("edit/", EditUserView.as_view()),
    path("status-update/", StatusUpdateView.as_view()),
]
