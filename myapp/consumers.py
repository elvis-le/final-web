from channels.generic.websocket import AsyncWebsocketConsumer
import json

class AdminNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "admin_notifications"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def new_user_notification(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def new_message_notification(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))
