from django.contrib import admin
from .models import FriendRequest, Friend, Conversation, Message

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'date_created', 'date_updated')

@admin.register(Friend)
class FriendAdmin(admin.ModelAdmin):
    # list_display = ('from_user', 'to_user', 'date_created', 'date_updated')
    pass


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    # list_display = ('friend', 'date_created', 'date_updated')
    pass

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'sender', 'text', 'date_created', 'date_updated')