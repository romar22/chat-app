from django.apps import apps
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **kwargs):
        if not username:
            raise ValueError("Email field is required.")
        user = self.model(username=username, **kwargs)
        user.set_password(password)
        user.is_active = True
        user.save()

        return user

    def create_superuser(self, username, password, **kwargs):
        user = self.create_user(username, password, **kwargs, )
        user.is_staff = True
        user.is_superuser = True
        user.save()

        return user