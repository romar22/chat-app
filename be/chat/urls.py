from django.urls import path, include
from .views import (
    FriendView,
)

urlpatterns = [
    path('friends/', include([
        path('', FriendView.as_view({
            'get': 'list',
        })),
    ])),
]