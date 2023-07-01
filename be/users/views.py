from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from be.permissions import permissions
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .serializers import (
    UserSerializer
)

class UserView(ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.all()

    # @permissions(IsAuthenticated, )
    # def retrieve(self, request, *args, **kwargs):
    #     return super().retrieve(request, *args, **kwargs)

    @permissions(
        IsAuthenticated, 
    )
    def me(self, request, *args, **kwargs):
        return Response(self.serializer_class(request.user).data)
