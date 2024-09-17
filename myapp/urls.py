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
    path('logout_user/', views.logout_user, name='logout_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('audio/<str:category>/', views.get_audios, name='get_audios'),
    path('text/<str:category>/', views.get_texts, name='get_texts'),
    path('sticker/<str:category>/', views.get_stickers, name='get_stickers'),
    path('effect/<str:category>/', views.get_effects, name='get_effects'),
    path('filter/<str:category>/', views.get_filters, name='get_filters'),
]