from django.urls import path
from .views import DashBoardView

urlpatterns = [
    path("", DashBoardView.as_view(), name="user-detail"),
]
