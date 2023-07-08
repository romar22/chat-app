from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class Consumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = self.scope['url_route']['kwargs']['group_name']

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

        await self.channel_layer.group_send(self.group_name, {
            'type': 'send_data',
            'data': data,
        })

    @staticmethod
    def send_message(group_name, data):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(group_name, {
                'type': 'send_data',
                'data': data
            }
        ) 

    async def send_data(self, event):
        data = event.get('data')
        await self.send(text_data=json.dumps(data))