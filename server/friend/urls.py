from django.urls import path

from .views import FriendListView

urlpatterns = [
    path("", FriendListView.as_view()),
]
