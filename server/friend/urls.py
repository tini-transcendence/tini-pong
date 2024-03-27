from django.urls import path

from .views import FriendListView, AddFriendView

urlpatterns = [
    path("", FriendListView.as_view()),
    path("add/", AddFriendView.as_view()),
]
