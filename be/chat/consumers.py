from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'chat'

        await self.channel_layer.group_add(
            self.group_name, 
            self.channel_name
        )

        await self.accept()
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name, 
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')

        event = {
            'type': 'chat_message',
            'message': message
        }

        await self.channel_layer.group_send(self.group_name, event)
    
    async def chat_message(self, event):
        message = event.get('message')

        await self.send(text_data=json.dumps({
            'message': message
        }))

