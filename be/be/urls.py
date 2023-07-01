from django.contrib import admin
from django.urls import path, include
from .jwt import PairTokenView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('token/', PairTokenView.as_view()),
        path('token/refresh/', TokenRefreshView.as_view()),
        path('users/', include('users.urls')),
        path('chat/', include('chat.urls')),
    ])),
]
