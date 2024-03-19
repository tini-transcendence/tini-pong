from django.urls import path
from .views import DashBoardView

urlpatterns = [
    path("<uuid:uuid>/", DashBoardView.as_view(), name="user-detail"),
]
