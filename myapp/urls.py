from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('cut_video/', views.cut_video, name='cut_video'),
    path('add_text_to_video/', views.add_text_to_video, name='add_text_to_video'),
    path('merge_videos/', views.merge_videos, name='merge_videos'),
    path('add_audio_to_video/', views.add_audio_to_video, name='add_audio_to_video'),
    path('add_sticker_to_video/', views.add_sticker_to_video, name='add_sticker_to_video'),

    path('register_user/', views.register_user, name='register_user'),
    path('login_user/', views.login_user, name='login_user'),
    path('logout_user/', views.logout_user, name='logout_user'),

    path('get_user_projects/', views.get_user_projects, name='get_user_projects'),
    path('create_project/', views.create_project, name='create_project'),

    path('upload_audio/', views.upload_audio, name='upload_audio'),
    path('get_all_audios/', views.get_all_audios, name='get_all_audios'),
    path('audio/<str:category>/', views.get_audios, name='get_audios'),

    path('upload_text/', views.upload_text, name='upload_text'),
    path('get_all_texts/', views.get_all_texts, name='get_all_texts'),
    path('text/<str:category>/', views.get_texts, name='get_texts'),

    path('upload_sticker/', views.upload_sticker, name='upload_sticker'),
    path('get_all_stickers/', views.get_all_stickers, name='get_all_stickers'),
    path('sticker/<str:category>/', views.get_stickers, name='get_stickers'),

    path('upload_sticker/', views.upload_sticker, name='upload_sticker'),
    path('get_all_stickers/', views.get_all_stickers, name='get_all_stickers'),
    path('effect/<str:category>/', views.get_effects, name='get_effects'),

    path('upload_filter/', views.upload_filter, name='upload_filter'),
    path('get_all_filters/', views.get_all_filters, name='get_all_filters'),
    path('filter/<str:category>/', views.get_filters, name='get_filters'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]