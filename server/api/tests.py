from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Room, TournamentHistory, WinLoseHistory, OneVsOneHistory
from django.utils import timezone
import uuid


class RoomTestCase(APITestCase):
    def setUp(self):
        # 두 명의 사용자 생성
        self.user1 = User.objects.create(
            uuid=uuid.uuid4(),
            id_42="user1",
            otp_secret="secret1",
            nickname="nickname1",
        )
        self.user2 = User.objects.create(
            uuid=uuid.uuid4(),
            id_42="user2",
            otp_secret="secret2",
            nickname="nickname2",
        )
        # 방 생성
        self.room = Room.objects.create(
            uuid=uuid.uuid4(),
            name="Test Room",
            type=1,
            difficulty=1,
            owner_uuid=self.user1,
        )
        # 생성된 방의 uuid를 저장
        self.room_uuid = self.room.uuid

    def test_create_room(self):
        # 방이 정상적으로 생성되었는지 확인
        room = Room.objects.get(uuid=self.room_uuid)
        self.assertEqual(room.name, "Test Room")
        self.assertEqual(room.owner_uuid, self.user1)

    def test_delete_room(self):
        # 방 삭제
        Room.objects.get(uuid=self.room_uuid).delete()
        # 방이 삭제되었는지 확인
        with self.assertRaises(Room.DoesNotExist):
            Room.objects.get(uuid=self.room_uuid)


class MatchTestCase(APITestCase):
    def setUp(self):
        # 사용자 생성
        self.user1 = User.objects.create(
            uuid=uuid.uuid4(),
            id_42="user1",
            otp_secret="secret1",
            nickname="nickname1",
        )
        self.user2 = User.objects.create(
            uuid=uuid.uuid4(),
            id_42="user2",
            otp_secret="secret2",
            nickname="nickname2",
        )
        # 매치 생성
        self.match = OneVsOneHistory.objects.create(
            uuid=uuid.uuid4(),
            play_time=timezone.now(),
            user1=self.user1,
            user2=self.user2,
            win_user=self.user1.uuid,
        )
        # 생성된 매치의 uuid를 저장
        self.match_uuid = self.match.uuid

    def test_create_match(self):
        # 매치가 정상적으로 생성되었는지 확인
        match = OneVsOneHistory.objects.get(uuid=self.match_uuid)
        self.assertEqual(match.user1, self.user1)
        self.assertEqual(match.user2, self.user2)
        self.assertEqual(str(match.win_user), str(self.user1.uuid))

    def test_update_match_result(self):
        # 매치 결과 업데이트
        match = OneVsOneHistory.objects.get(uuid=self.match_uuid)
        match.win_user = self.user2.uuid
        match.save()
        # 매치 결과가 업데이트되었는지 확인
        updated_match = OneVsOneHistory.objects.get(uuid=self.match_uuid)
        self.assertEqual(str(updated_match.win_user), str(self.user2.uuid))


class RoomListTestCase(APITestCase):
    def setUp(self):
        owner1 = User.objects.create(
            uuid=uuid.uuid4(),
            id_42="owner1",
            otp_secret="owner1",
            nickname="nickname1",
        )
        owner2 = User.objects.create(
            uuid=uuid.uuid4(),
            id_42="owner2",
            otp_secret="owner2",
            nickname="nickname2",
        )

        Room.objects.create(name="Room 1", type=1, difficulty=1, owner_uuid=owner1)
        Room.objects.create(name="Room 2", type=2, difficulty=2, owner_uuid=owner2)

    def test_room_list(self):
        # 룸 리스트 뷰에 대한 GET 요청
        url = reverse("rooms_list")
        response = self.client.get(url, format="json")

        # 응답이 성공적인지 (HTTP 200) 확인
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # JSON 응답에 룸 객체 리스트가 포함되어 있는지 확인
        self.assertIn("rooms", response.data)

        # 응답에 포함된 룸 객체의 수가 올바른지 확인
        self.assertEqual(len(response.data["rooms"]), 2)

        rooms_in_response = response.data["rooms"]
        self.assertEqual(rooms_in_response[0]["name"], "Room 1")
        self.assertEqual(rooms_in_response[1]["name"], "Room 2")


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
