from django.urls import path
from .views import DashBoardView, StoreTransactionView

urlpatterns = [
    path("", DashBoardView.as_view(), name="user-detail"),
    path("test", StoreTransactionView.as_view())
]
