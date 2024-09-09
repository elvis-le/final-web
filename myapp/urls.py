from django.contrib import admin
from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('cut_video/', views.cut_video, name='cut_video'),
    path('add_text_to_video/', views.add_text_to_video, name='add_text_to_video'),
    path('merge_videos/', views.merge_videos, name='merge_videos'),
    path('add_audio_to_video/', views.add_audio_to_video, name='add_audio_to_video'),
]