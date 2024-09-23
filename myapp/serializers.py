from rest_framework import serializers
from .models import User, Project, Video, Audio, Text, Sticker, Effect, Filter, EditSession, Role


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'username', 'role', 'birth_date', 'sex', 'address', 'is_delete', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user'),
            birth_date=validated_data.get('birth_date', None),
            sex=validated_data.get('sex', None),
            address=validated_data.get('address', None),
            is_delete=validated_data.get('is_delete', False)
        )
        return user

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'user', 'name', 'is_delete', 'created_at', 'updated_at']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'project', 'video_url', 'name', 'duration', 'status', 'is_delete', 'created_at', 'updated_at']

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = ['id', 'audio_file', 'name', 'image', 'artist', 'duration', 'category', 'is_delete', 'created_at', 'updated_at']

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ['id', 'image', 'content', 'style', 'category', 'is_delete', 'created_at', 'updated_at']

class StickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sticker
        fields = ['id', 'sticker_file', 'name', 'duration', 'category', 'is_delete', 'created_at', 'updated_at']


class EffectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Effect
        fields = ['id', 'name', 'image', 'duration', 'category', 'config', 'is_delete', 'created_at', 'updated_at']

class FilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = ['id', 'name', 'image', 'category', 'config', 'intensity', 'is_delete', 'created_at', 'updated_at']

class EditSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EditSession
        fields = ['id', 'user', 'project', 'actions', 'created_at', 'updated_at']

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'role_name']


