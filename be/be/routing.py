from django.urls import re_path, path
from .consumer import Consumer

websocket_urlpatterns = [
    path('ws/<str:group_name>/', Consumer().as_asgi()),
]