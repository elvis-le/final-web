from django.contrib import admin
from django.urls import path
from . import views
from . import consumers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .consumers import AdminNotificationConsumer

urlpatterns = [
    path('cut_video/', views.cut_video, name='cut_video'),
    path('add_text_to_video/', views.add_text_to_video, name='add_text_to_video'),
    path('export_video/', views.export_video, name='export_video'),
    path('merge_video/', views.merge_video, name='merge_video'),
    path('apply_audio/', views.apply_audio, name='apply_audio'),
    path('apply_sticker/', views.apply_sticker, name='apply_sticker'),
    path('apply_text/', views.apply_text, name='apply_text'),
    path('apply_filter/', views.apply_filter, name='apply_filter'),
    path('apply_effect/', views.apply_effect, name='apply_effect'),
    path('add_audio_to_video/', views.add_audio_to_video, name='add_audio_to_video'),
    path('add_sticker_to_video/', views.add_sticker_to_video, name='add_sticker_to_video'),
    path('upload_video/', views.upload_video, name='upload_video'),
    path('video/<str:project>/', views.get_videos, name='get_videos'),
    path('save_edit_session/', views.save_edit_session, name='save_edit_session'),
    path('edit_session/<int:project_id>/', views.get_edit_session, name='get_edit_session'),
    path('validate_token/', views.validate_token, name='validate_token'),
    path('verify-email/<int:user_id>/', views.verify_email, name='verify_email'),
    path('auth/google/init/', views.google_auth_init, name="google_auth_init"),
    path('auth/google/callback/', views.google_auth_callback, name="google_auth_callback"),
    path('auth/set-password/<uidb64>/<token>/', views.set_password, name="set_password"),
    path('set-password/<uidb64>/<token>/', views.set_password, name='set_password'),
    path('split_video/', views.split_video, name='split_video'),
    path('split_audio/', views.split_audio, name='split_audio'),
    path('set_new_user/', views.set_new_user, name='set_new_user'),

    path('register_user/', views.register_user, name='register_user'),
    path('login_user/', views.login_user, name='login_user'),
    path('logout_user/', views.logout_user, name='logout_user'),
    path('update_user/<int:userId>/', views.update_user, name='update_user'),
    path('get_all_users/', views.get_all_users, name='get_all_users'),
    path('lock_user/', views.lock_user, name='lock_user'),
    path('unlock_user/', views.unlock_user, name='unlock_user'),
    path('change_password/<int:userId>/', views.change_password, name='change_password'),

    path('get_message_user/<int:userId>/', views.get_message_user, name='get_message_user'),

    path('update_message/<int:userId>/', views.update_message, name='update_message'),

    path('get_user_projects/', views.get_user_projects, name='get_user_projects'),
    path('get_user_deleted_projects/', views.get_user_deleted_projects, name='get_user_deleted_projects'),
    path('delete_project/', views.delete_project, name='delete_project'),
    path('restore_project/', views.restore_project, name='restore_project'),
    path('restore_all_project/', views.restore_all_project, name='restore_all_project'),
    path('delete_all_project/', views.delete_all_project, name='delete_all_project'),
    path('create_project/', views.create_project, name='create_project'),
    path('ws/admin/', AdminNotificationConsumer.as_asgi(), name='admin_ws'),

    path('upload_audio/', views.upload_audio, name='upload_audio'),
    path('get_all_audios/', views.get_all_audios, name='get_all_audios'),
    path('audio/<str:category>/', views.get_audios, name='get_audios'),
    path('get_audio_by_id/<int:audioId>/', views.get_audio_by_id, name='get_audio_by_id'),
    path('update_audio/<int:audioId>/', views.update_audio, name='update_audio'),
    path('delete_audio/', views.delete_audio, name='delete_audio'),

    path('upload_text/', views.upload_text, name='upload_text'),
    path('get_all_texts/', views.get_all_texts, name='get_all_texts'),
    path('text/<str:category>/', views.get_texts, name='get_texts'),
    path('get_text_by_id/<int:textId>/', views.get_text_by_id, name='get_text_by_id'),
    path('update_text/<int:textId>/', views.update_text, name='update_text'),
    path('delete_text/', views.delete_text, name='delete_text'),

    path('upload_sticker/', views.upload_sticker, name='upload_sticker'),
    path('get_all_stickers/', views.get_all_stickers, name='get_all_stickers'),
    path('sticker/<str:category>/', views.get_stickers, name='get_stickers'),
    path('get_sticker_by_id/<int:stickerId>/', views.get_sticker_by_id, name='get_sticker_by_id'),
    path('update_sticker/<int:stickerId>/', views.update_sticker, name='update_sticker'),
    path('delete_sticker/', views.delete_sticker, name='delete_sticker'),

    path('upload_effect/', views.upload_effect, name='upload_effect'),
    path('get_all_effects/', views.get_all_effects, name='get_all_effects'),
    path('effect/<str:category>/', views.get_effects, name='get_effects'),
    path('get_effect_by_id/<int:effectId>/', views.get_effect_by_id, name='get_effect_by_id'),
    path('update_effect/<int:effectId>/', views.update_effect, name='update_effect'),
    path('delete_effect/', views.delete_effect, name='delete_effect'),

    path('upload_filter/', views.upload_filter, name='upload_filter'),
    path('get_all_filters/', views.get_all_filters, name='get_all_filters'),
    path('filter/<str:category>/', views.get_filters, name='get_filters'),
    path('get_filter_by_id/<int:filterId>/', views.get_filter_by_id, name='get_filter_by_id'),
    path('update_filter/<int:filterId>/', views.update_filter, name='update_filter'),
    path('delete_filter/', views.delete_filter, name='delete_filter'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]