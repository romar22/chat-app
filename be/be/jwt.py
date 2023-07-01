from rest_framework import serializers
from utils.query import get_object_or_none
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class PairTokenSerializer(TokenObtainPairSerializer):
    error = _("Incorrect Credentials. Please try again.")

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError(self.error)

        user = get_object_or_none(get_user_model(), username__iexact=username)
        if not user:
            raise serializers.ValidationError(self.error)

        self.user = authenticate(**attrs)
        if not self.user:
            raise serializers.ValidationError(self.error)

        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data
    


from rest_framework_simplejwt.views import TokenObtainPairView

class PairTokenView(TokenObtainPairView):
    serializer_class = PairTokenSerializer