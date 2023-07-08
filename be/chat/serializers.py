from rest_framework.serializers import ModelSerializer

from .models import (
    FriendRequest,
    Friend,
    Conversation,
    Message,
)
from users.serializers import (
    UserSerializer,
)

from be.consumer import Consumer

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class FriendSerializer(ModelSerializer):
    # user = UserSerializer()
    friends = UserSerializer(many=True)

    class Meta:
        model = Friend
        fields = ('id', 'friends', )


class ConversationSerializer(ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ('id', 'participants', )


class MessageSerializer(ModelSerializer):
    sender = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'text',)
    
    def create(self, validated_data):
        message = Message.objects.create(
            **validated_data, 
            sender=self.context['request'].user
        )

        Consumer.send_message('chat', 
            MessageSerializer(message).data
        )

        return message