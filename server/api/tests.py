from django.test import TestCase, Client
from .models import User, Room, OneVsOneHistory
from django.utils import timezone
import uuid
from django.urls import reverse


class RoomTestCase(TestCase):
    def setUp(self):
        # 두 명의 사용자 생성
        self.user1_uuid = uuid.uuid4()
        self.user2_uuid = uuid.uuid4()
        self.user1 = User.objects.create(
            uuid=self.user1_uuid,
            id_42="user1",
            otp_secret="secret1",
            nickname="nickname1",
        )
        self.user2 = User.objects.create(
            uuid=self.user2_uuid,
            id_42="user2",
            otp_secret="secret2",
            nickname="nickname2",
        )
        # 방 생성
        self.room_uuid = uuid.uuid4()
        self.room = Room.objects.create(
            uuid=self.room_uuid,
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


class MatchTestCase(TestCase):
    def setUp(self):
        # 사용자 생성
        self.user1_uuid = uuid.uuid4()
        self.user2_uuid = uuid.uuid4()
        self.user1 = User.objects.create(
            uuid=self.user1_uuid,
            id_42="user1",
            otp_secret="secret1",
            nickname="nickname1",
        )
        self.user2 = User.objects.create(
            uuid=self.user2_uuid,
            id_42="user2",
            otp_secret="secret2",
            nickname="nickname2",
        )
        # 매치 생성
        self.match_uuid = uuid.uuid4()
        self.match = OneVsOneHistory.objects.create(
            uuid=self.match_uuid,
            play_time=timezone.now(),
            user1=self.user1,
            user2=self.user2,
            win_user=self.user1.uuid,
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


from django.test import TestCase, Client
from django.urls import reverse
from .models import Room, User


class RoomListTestCase(TestCase):
    def setUp(self):
        owner1 = User.objects.create(
            id_42="owner1",
            otp_secret="owner1",
            nickname="nickname1",
            avatar="avatar_url1",
        )
        owner2 = User.objects.create(
            id_42="owner2",
            otp_secret="owner2",
            nickname="nickname2",
            avatar="avatar_url2",
        )

        Room.objects.create(name="Room 1", type=1, difficulty=1, owner_uuid=owner1)
        Room.objects.create(name="Room 2", type=2, difficulty=2, owner_uuid=owner2)

        # Django 테스트 클라이언트 인스턴스 생성
        self.client = Client()

    def test_room_list(self):
        # 룸 리스트 뷰에 대한 GET 요청
        response = self.client.get(reverse("rooms_list"))

        # 응답이 성공적인지 (HTTP 200) 확인
        self.assertEqual(response.status_code, 200)

        # 사용된 템플릿이 올바른지 확인
        self.assertTemplateUsed(response, "rooms_list.html")

        # 응답 컨텍스트에 룸 객체 리스트가 포함되어 있는지 확인
        self.assertTrue("rooms" in response.context)

        # 컨텍스트에 포함된 룸 객체의 수가 올바른지 확인
        self.assertEqual(len(response.context["rooms"]), 2)

        rooms_in_context = response.context["rooms"]
        self.assertEqual(rooms_in_context[0].name, "Room 1")
        self.assertEqual(rooms_in_context[1].name, "Room 2")
