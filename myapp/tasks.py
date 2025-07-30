from supabase import create_client, Client
import asyncio
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

SUPABASE_URL = "https://your-project-url.supabase.co"
SUPABASE_KEY = "your-service-role-key"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


async def listen_to_realtime():
    realtime = supabase.realtime.subscribe("users")

    @realtime.on_insert
    async def handle_insert(payload):
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            "admin_notifications",
            {
                "type": "new_user",
                "message": f"New user registered: {payload['new']['email']}",
            },
        )

    await supabase.realtime.connect()


# Chạy task trong server
asyncio.create_task(listen_to_realtime())
