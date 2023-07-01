from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet

from .serializers import (
    FriendSerializer
)

class FriendView(ModelViewSet):
    serializer_class = FriendSerializer

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.all()

