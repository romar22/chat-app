from rest_framework.serializers import ModelSerializer

from .models import (
    FriendRequest,
    Friend,
    Conversation,
    Message,
)
from users.serializers import (
    UserSerializer
)


class FriendSerializer(ModelSerializer):
    from_user = UserSerializer()

    class Meta:
        model = Friend
        fields = '__all__'