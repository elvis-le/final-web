from django.urls import path, include
from rest_framework import serializers
from .models import Users, Project, Video, VideoEdit

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'birth_date', 'sex', 'address']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'user', 'title', 'description', 'created_at', 'updated_at']
class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'project', 'title', 'description', 'file_url', 'created_at', 'updated_at']

class VideoEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoEdit
        fields = ['id', 'video', 'created_at', 'updated_at']
