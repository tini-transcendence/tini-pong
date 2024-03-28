import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from room.models import Room, RoomUser
from user.models import User


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_uuid = self.scope["url_route"]["kwargs"]["room_uuid"]
        self.room_group_name = "room_%s" % self.room_uuid

        # print("!@#!@!$!@@@@@@@@@@@@@@@@")
        # print(self.scope)
        # print("!@#!@!$!@@@@@@@@@@@@@@@@")
        self.user = self.scope["user"]
        if not await self.is_user_in_room(self.user, self.room_uuid):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get("action")

        if action == "ready" and not await self.is_room_owner(
            self.user, self.room_uuid
        ):
            await self.set_ready_status(self.user, text_data_json["ready"])
        elif action == "start_game" and await self.is_room_owner(
            self.user, self.room_uuid
        ):
            await self.start_game()
        elif action == "leave":
            await self.leave_room()

    async def room_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def is_user_in_room(self, user, room_uuid):
        return RoomUser.objects.filter(
            user_uuid_id=user.uuid, room_uuid=room_uuid
        ).exists()

    @database_sync_to_async
    def is_room_owner(self, user, room_uuid):
        room = Room.objects.get(uuid=room_uuid)
        return room.owner == user.uuid

    @database_sync_to_async
    def set_ready_status(self, user, ready):
        room_user = RoomUser.objects.get(user=user.uuid, room__uuid=self.room_uuid)
        room_user.is_ready = ready
        room_user.save()

    @database_sync_to_async
    def start_game(self):
        room = Room.objects.get(uuid=self.room_uuid)
        if all(user.is_ready for user in room.roomuser_set.all()):
            room.is_active = True
            room.save()

    @database_sync_to_async
    def leave_room(self):
        # Implement logic to handle a user leaving the room
        pass
