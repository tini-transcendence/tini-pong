import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from room.models import Room, RoomUser
from user.models import User
from channels.layers import get_channel_layer
from django.db import transaction


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

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get("action")

        if action == "join":
            player_number = await self.assign_player_number()
            self.player_number = player_number
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "room_message",
                    "message": {
                        "action": "player_joined",
                        "user_uuid": str(self.user.uuid),
                        "user_nickname": self.user.nickname,
                        "player_number": player_number,
                    },
                },
            )
        elif action == "ready":
            ready = text_data_json["is_ready"]
            player_number, is_ready = await self.set_ready_status(self.user, ready)
            if player_number is not None:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "room_message",
                        "message": {
                            "action": "ready",
                            "player_number": player_number,
                            "is_ready": is_ready,
                        },
                    },
                )
            await self.set_ready_status(self.user, text_data_json["is_ready"])
        elif action == "start_game" and await self.is_room_owner(
            self.user, self.room_uuid
        ):
            await self.start_game()
        elif action == "leave":
            await self.leave_room()
            await self.close()
        elif action == "key_press":
            await self.handle_key_press(text_data_json["key"])

    async def room_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    async def handle_key_press(self, key):
        player_number = await self.get_player_number(self.user)

        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "player_key_press", "player_number": player_number, "key": key},
        )

    async def player_key_press(self, event):
        if event["player_number"] != self.player_number:
            await self.send(
                text_data=json.dumps(
                    {
                        "type": "key_press",
                        "player_number": event["player_number"],
                        "key": event["key"],
                    }
                )
            )

    async def leave_room(self):
        try:
            room = await database_sync_to_async(Room.objects.get)(uuid=self.room_uuid)
            user = self.scope["user"]

            room_user = await database_sync_to_async(RoomUser.objects.filter)(
                room_uuid=room, user_uuid=user
            ).first()
            if not room_user:
                await self.send(
                    text_data=json.dumps({"error": "User is not in the room."})
                )
                return

            channel_layer = get_channel_layer()
            group_name = f"room_{self.room_uuid}"

            if room.owner_uuid == user.uuid:
                room_users = await database_sync_to_async(RoomUser.objects.filter)(
                    room_uuid=room
                )
                for member in room_users:
                    await self.channel_layer.group_discard(group_name, member.user_uuid)
                    await database_sync_to_async(member.delete)()

                await database_sync_to_async(room.delete)()
                await self.send(
                    text_data=json.dumps(
                        {"message": "Room closed and all users removed by owner"}
                    )
                )
            else:
                await self.channel_layer.group_discard(group_name, user.channel_name)
                await database_sync_to_async(room_user.delete)()
                await self.send(
                    text_data=json.dumps({"message": "Left room successfully"})
                )
        except Room.DoesNotExist:
            await self.send(text_data=json.dumps({"error": "Room not found"}))
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({"error": "User not found"}))

    async def disconnect(self, close_code):
        player_number = await self.remove_player_number(self.player_number)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "room_message",
                "message": {
                    "action": "player_left",
                    "player_number": player_number,
                    "user_uuid": str(self.user.uuid),
                },
            },
        )
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )

    @database_sync_to_async
    def is_user_in_room(self, user, room_uuid):
        return RoomUser.objects.filter(
            user_uuid_id=user.uuid, room_uuid=room_uuid
        ).exists()

    @database_sync_to_async
    def is_room_owner(self, user, room_uuid):
        room = Room.objects.get(uuid=room_uuid)
        return room.owner_uuid == user.uuid

    @database_sync_to_async
    def set_ready_status(self, user, ready):
        try:
            room_user, created = RoomUser.objects.get_or_create(
                user_uuid=user.uuid, room_uuid=self.room_uuid
            )
            room_user.is_ready = ready
            room_user.save()
            return room_user.player_number, room_user.is_ready
        except RoomUser.MultipleObjectsReturned:
            room_users = RoomUser.objects.filter(
                user_uuid=user.uuid, room_uuid=self.room_uuid
            )
            if room_users:
                room_user = room_users.first()
                room_user.is_ready = ready
                room_user.save()
                for extra_user in room_users[1:]:
                    extra_user.delete()
                return room_user.player_number, room_user.is_ready
        return None

    @database_sync_to_async
    def assign_player_number(self):
        with transaction.atomic():
            room = Room.objects.get(uuid=self.room_uuid)

            occupied_numbers = (
                RoomUser.objects.filter(room_uuid=room)
                .exclude(player_number__isnull=True)
                .values_list("player_number", flat=True)
                .order_by("player_number")
            )

            player_number = 1
            for occupied_number in occupied_numbers:
                if player_number < occupied_number:
                    break
                player_number += 1

            RoomUser.objects.create(
                room_uuid=room,
                user_uuid=self.user,
                player_number=player_number,
            )

        return player_number

    @database_sync_to_async
    def get_player_number(self, user):
        room_user = RoomUser.objects.get(user=user, room_uuid=self.room_uuid)
        return room_user.player_number

    @database_sync_to_async
    def remove_player_number(self, player_number):
        RoomUser.objects.filter(
            room_uuid=self.room_uuid, player_number=player_number
        ).update(player_number=None)
        return player_number

    @database_sync_to_async
    def start_game(self):
        room = Room.objects.get(uuid=self.room_uuid)
        if all(user.is_ready for user in room.roomuser_set.all()):
            room.is_active = True
            room.save()
