import asyncio
import websockets

async def test_websocket():
    uri = "ws://localhost:8000/ws/admin/"
    async with websockets.connect(uri) as websocket:
        print("WebSocket connected!")
        await websocket.recv()  # Chờ thông báo từ server

asyncio.run(test_websocket())
