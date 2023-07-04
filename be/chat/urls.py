from django.urls import path, include
from .views import (
    FriendView,
    ConversationView,
    MessageView,
)

urlpatterns = [
    path('friends/', include([
        path('', FriendView.as_view({
            'get': 'list',
        })),
    ])),
    path('conversation/', include([
        path('', ConversationView.as_view({
            'get': 'list',
        })),
        path('<int:conversation_id>/', include([
            path('messages/', include([
                path('', MessageView.as_view({
                    'get': 'list',
                })),
            ])),
        ])),
    ])),
]