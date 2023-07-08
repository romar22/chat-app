from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from users.models import User
from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


class QueryAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        '''
        user_id = -1
        try:
            user_id = parse_qs(scope["query_string"].decode("utf8"))["user_id"][0]
        except:
            pass

        scope['user'] = await get_user(user_id)
        '''

        return await self.app(scope, receive, send)