from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from users.models import (
    User
)


class FriendRequest(models.Model):
    from_user           = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_request_sent')
    to_user             = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_request_received')

    date_created        = models.DateTimeField(auto_now_add=True)
    date_updated        = models.DateTimeField(auto_now=True)



class Friend(models.Model):
    user                = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user')
    friends             = models.ManyToManyField(User, blank=True, related_name='friends')

    date_created        = models.DateTimeField(auto_now_add=True)
    date_updated        = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.user.username
    
    class Meta:
        verbose_name_plural = 'Friend'



class Conversation(models.Model):
    participants        = models.ManyToManyField(User, related_name='conversations')

    date_created        = models.DateTimeField(auto_now_add=True)
    date_updated        = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_updated']

class Message(models.Model):
    conversation        = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender              = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages_sent')
    text                = models.TextField()

    date_created        = models.DateTimeField(auto_now_add=True)
    date_updated        = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs) :
        conversation = Conversation.objects.filter(pk=self.conversation.pk)
        conversation.update(date_updated=timezone.now())

        return super().save(*args, **kwargs)
