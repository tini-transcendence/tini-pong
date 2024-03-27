import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from room.models import Room, RoomUser
from user.models import User


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_uuid = self.scope["url_route"]["kwargs"]["room_uuid"]
        self.room_group_name = "room_%s" % self.room_uuid

        self.user = self.scope["user"]
        if not await self.is_user_in_room(self.user, self.room_uuid):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get("action")

        # 방장이 아닌 유저
        if action == "ready" and not await self.is_room_owner(
            self.user, self.room_uuid
        ):
            await self.set_ready_status(self.user, text_data_json["ready"])

        # 방장인 유저
        elif action == "start_game" and await self.is_room_owner(
            self.user, self.room_uuid
        ):
            await self.start_game()

        # 모든 유저의 경우 (방 퇴장은 LeaveRoomView로 요청하도록 해주시면 됩니다 !!)
        elif action == "leave":
            await self.leave_room()

    async def room_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def is_user_in_room(self, user, room_uuid):
        return RoomUser.objects.filter(
            user_uuid=user, room_uuid__uuid=room_uuid
        ).exists()

    @database_sync_to_async
    def is_room_owner(self, user, room_uuid):
        room = Room.objects.get(uuid=room_uuid)
        return room.owner_uuid == user

    #@database_sync_to_async
    #async def set_ready_status(self, user, ready):
    #    room_user = RoomUser.objects.get(user_uuid=user, room_uuid__uuid=self.room_uuid)
    #    room_user.is_ready = ready
    #    room_user.save()
    #    # 준비 상태 변경을 모든 클라이언트에게 전송

    #    await self.channel_layer.group_send(
    #        self.room_group_name,
    #        {
    #            "type": "room_message",
    #            "message": {
    #                "action": "user_ready",
    #                "user_uuid": user.uuid,
    #                "ready": ready,
    #            },
    #        },
    #    )

    #@database_sync_to_async
    #async def start_game(self):
    #    room = Room.objects.get(uuid=self.room_uuid)
    #    # 모든 유저가 준비되었는지 확인

    #    if all(user.is_ready for user in room.room_users.all()):
    #        room.is_active = True
    #        room.save()
    #        # 게임 시작을 모든 클라이언트에게 전송
    #        await self.channel_layer.group_send(
    #            self.room_group_name,
    #            {
    #                "type": "room_message",
    #                "message": {
    #                    "action": "start_game",
    #                },
    #            },
    #        )
