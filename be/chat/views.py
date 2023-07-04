from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from .serializers import (
    FriendSerializer,
    ConversationSerializer,
    MessageSerializer,
)

class FriendView(ModelViewSet):
    serializer_class = FriendSerializer

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.filter(user=self.request.user)
    


class ConversationView(ModelViewSet):
    serializer_class = ConversationSerializer

    def get_queryset(self):
        print(self.request.user)
        return self.serializer_class.Meta.model.objects.filter(participants=self.request.user)   
    

class MessageView(ModelViewSet):
    serializer_class = MessageSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.serializer_class.Meta.model.objects.filter(**kwargs)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
