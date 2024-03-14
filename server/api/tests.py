from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Room, OneVsOneHistory
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
            win_user=self.user1,
        )

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
