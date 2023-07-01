from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from users.models import (
    User
)


class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_request_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_request_received')

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

class Friend(models.Model):
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE)

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)


class Conversation(models.Model):
    friend = models.ForeignKey(Friend, on_delete=models.CASCADE, related_name='conversations')

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_sent')
    text = models.TextField()

    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

@receiver(post_save, sender=Friend)
def create_friend(sender, instance, created, **kwargs):
    if created:
        Conversation.objects.create(friend=instance)