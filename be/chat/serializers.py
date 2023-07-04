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
    sender = UserSerializer()
    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'text',)
