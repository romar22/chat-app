from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from .serializers import (
    FriendSerializer,
    ConversationSerializer,
    MessageSerializer,
)

from .paginations import (
    MessagesPagination
)

class FriendView(ModelViewSet):
    serializer_class = FriendSerializer

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.filter(user=self.request.user)
    


class ConversationView(ModelViewSet):
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.filter(participants=self.request.user)   
    

class MessageView(ModelViewSet):
    serializer_class = MessageSerializer
    pagination_class = MessagesPagination

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.all()

    def list(self, request, *args, **kwargs):
        qs = self.serializer_class.Meta.model.objects.filter(**kwargs)
        paginated_qs = self.paginate_queryset(qs)
        serializer = self.serializer_class(paginated_qs, many=True)
        return self.get_paginated_response(serializer.data)
