from rest_framework import serializers
from .models import User, Project, Video, Audio, Text, Sticker, Effect, Filter, EditSession, Role


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'fullname', 'username', 'role', 'image', 'birth_date', 'sex', 'address', 'is_delete', 'is_valid', 'is_verified', 'is_new', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        email = validated_data.pop('email')
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            email=email,
            username=username,
            password=password,
            **validated_data
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
        fields = ['id', 'name', 'image', 'content', 'style', 'category', 'is_delete', 'created_at', 'updated_at']

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


