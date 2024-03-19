from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, TournamentHistory, WinLoseHistory, OneVsOneHistory
from django.utils import timezone
import uuid

# Create your tests here.


class UserDetailAPITest(APITestCase):
    def setUp(self):
        # 사용자 생성
        self.user = User.objects.create(
            uuid=uuid.uuid4(),
            id_42="user42",
            otp_secret="secret42",
            nickname="TestUser",
            avatar="http://example.com/avatar.png",
        )

        # 토너먼트 기록 생성
        self.tournament_history = TournamentHistory.objects.create(
            play_time=timezone.now(),
            user1=self.user,
            user2=User.objects.create(
                uuid=uuid.uuid4(),
                id_42="user43",
                otp_secret="secret43",
                nickname="Opponent1",
            ),
            user3=User.objects.create(
                uuid=uuid.uuid4(),
                id_42="user44",
                otp_secret="secret44",
                nickname="Opponent2",
            ),
            user4=User.objects.create(
                uuid=uuid.uuid4(),
                id_42="user45",
                otp_secret="secret45",
                nickname="Opponent3",
            ),
            win_user=str(self.user.uuid),
        )

        # 승패 기록 생성
        self.win_lose_history = WinLoseHistory.objects.create(
            user_uuid=self.user, game_count=10, victory_count=7, defeat_count=3
        )

        # 1대1 기록 생성
        self.one_vs_one_history = OneVsOneHistory.objects.create(
            play_time=timezone.now(),
            user1=self.user,
            user2=User.objects.create(
                uuid=uuid.uuid4(),
                id_42="user46",
                otp_secret="secret46",
                nickname="Opponent4",
            ),
            win_user=str(self.user.uuid),
        )

    def test_user_detail(self):
        url = reverse("user-detail", kwargs={"uuid": self.user.uuid})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nickname"], self.user.nickname)
        self.assertEqual(response.data["avatar"], self.user.avatar)

        # 토너먼트 기록, 승패 기록, 1대1 기록이 포함되어 있는지 확인
        self.assertTrue("tournament_histories" in response.data)
        self.assertTrue("win_lose_histories" in response.data)
        self.assertTrue("one_vs_one_histories" in response.data)

        # 각 기록의 수가 예상과 일치하는지 확인
        self.assertEqual(len(response.data["tournament_histories"]), 1)
        self.assertEqual(len(response.data["win_lose_histories"]), 1)
        self.assertEqual(len(response.data["one_vs_one_histories"]), 1)
