from django.http import HttpRequest, HttpResponse
from django.views import View

from http import HTTPStatus


class RefreshTokenView(View):
    def post(self, request: HttpRequest):
        return HttpResponse(status=HTTPStatus.UNAUTHORIZED)
