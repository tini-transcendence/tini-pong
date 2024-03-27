from django.urls import path

from .views import FriendListView, AddFriendView, DeleteFriendView

urlpatterns = [
    path("", FriendListView.as_view()),
    path("add/", AddFriendView.as_view()),
    path("delete/", DeleteFriendView.as_view()),
]
