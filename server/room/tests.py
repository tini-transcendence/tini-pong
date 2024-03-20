from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Room
from django.utils import timezone
import uuid

# Create your tests here.


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
        self.room1 = Room.objects.create(
            uuid=uuid.uuid4(),
            name="Test Room 1",
            type=1,
            difficulty=1,
            owner_uuid=self.user1,
        )

        self.room2 = Room.objects.create(
            uuid=uuid.uuid4(),
            name="Test Room 2",
            type=2,
            difficulty=2,
            owner_uuid=self.user2,
        )
        # 생성된 방의 uuid를 저장
        self.room1_uuid = self.room1.uuid
        self.room2_uuid = self.room2.uuid

    def test_create_room(self):
        # 방이 정상적으로 생성되었는지 확인
        room = Room.objects.get(uuid=self.room1_uuid)
        self.assertEqual(room.name, "Test Room1")
        self.assertEqual(room.owner_uuid, self.user1)

        room = Room.objects.get(uuid=self.room2_uuid)
        self.assertEqual(room.name, "Test Room2")
        self.assertEqual(room.owner_uuid, self.user2)

    def test_delete_room(self):
        # 방 삭제
        Room.objects.get(uuid=self.room1_uuid).delete()
        Room.objects.get(uuid=self.room2_uuid).delete()
        # 방이 삭제되었는지 확인
        with self.assertRaises(Room.DoesNotExist):
            Room.objects.get(uuid=self.room1_uuid)
            Room.objects.get(uuid=self.room2_uuid)

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
        self.assertEqual(rooms_in_response[0]["name"], "Test Room1")
        self.assertEqual(rooms_in_response[1]["name"], "Test Room2")
