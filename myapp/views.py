from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, FileResponse
from django.contrib.auth import authenticate
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, AudioFileClip, ImageClip
from moviepy.config import change_settings
from tempfile import NamedTemporaryFile
from django.views.decorators.csrf import csrf_exempt
from tempfile import NamedTemporaryFile
from django.conf import settings
from django.utils.timezone import now
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from .serializers import *
from rest_framework import status
import os
import json
import logging

def home(request):
    return render(request, 'home.html')

@csrf_exempt
def upload_video(request):
    if request.method == 'POST':
        video_file = request.FILES['video']
        video = Video.objects.create(video_file=video_file)
        return JsonResponse({'success': True, 'video_id': video.id})
    return JsonResponse({'success': False})

logger = logging.getLogger(__name__)

@csrf_exempt
def cut_video(request):
    logger.info('Received a request to cut video.')
    if request.method == 'POST':
        try:
            start_time = float(request.POST.get('start'))
            end_time = float(request.POST.get('end'))
            video_file = request.FILES.get('file')

            if not video_file:
                logger.error('No video file provided.')
                return JsonResponse({'message': 'No video file provided'}, status=400)

            if start_time >= end_time or start_time < 0:
                logger.error('Invalid start or end time.')
                return JsonResponse({'message': 'Invalid start or end time'}, status=400)

            with NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
                for chunk in video_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name

            logger.info(f'Temporary file created at: {temp_file_path}')

            with VideoFileClip(temp_file_path) as video:
                new_clip = video.subclip(start_time, end_time)
                output_path = os.path.join(settings.MEDIA_ROOT, 'cut_video.mp4')
                new_clip.write_videofile(output_path, codec='libx264')

            logger.info(f'Video cut successfully at: {output_path}')
            return JsonResponse({'video_url': f'/media/cut_video.mp4'})
        except Exception as e:
            logger.error(f"Error while cutting video: {e}")
            return JsonResponse({'message': f'Error while processing video: {str(e)}'}, status=500)
    return JsonResponse({'message': 'Invalid request method'}, status=400)

change_settings({"IMAGEMAGICK_BINARY": "/usr/bin/convert"})
@csrf_exempt
def add_text_to_video(request):
    if request.method == 'POST':
        try:
            video_file = request.FILES['file']
            text_to_add = request.POST['text']

            output_filename = 'output_video.mp4'
            output_file_path = os.path.join(settings.MEDIA_ROOT, output_filename)

            video = VideoFileClip(video_file.temporary_file_path())

            text_clip = TextClip(text_to_add, fontsize=70, color='white').set_position(('center', 'bottom')).set_duration(video.duration)

            video_with_text = CompositeVideoClip([video, text_clip])

            video_with_text.write_videofile(output_file_path)

            return JsonResponse({'video_url': f'{settings.MEDIA_URL}{output_filename}'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def merge_videos(request):
    if request.method == 'POST':
        files = request.FILES.getlist('videos')
        clips = []

        for file in files:
            clip = VideoFileClip(file.temporary_file_path())
            clips.append(clip)

        final_clip = concatenate_videoclips(clips)
        output_path = 'media/merged_video.mp4'
        final_clip.write_videofile(output_path)

        return JsonResponse({'merged_video_url': f'/media/merged_video.mp4'})

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def add_audio_to_video(request):
    if request.method == 'POST':
        video_file = request.FILES['video']
        audio_file = request.FILES['audio']

        with NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
            for chunk in video_file.chunks():
                temp_video.write(chunk)
            video_path = temp_video.name

        with NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
            for chunk in audio_file.chunks():
                temp_audio.write(chunk)
            audio_path = temp_audio.name

        output_path = os.path.join(settings.MEDIA_ROOT, 'video_with_audio.mp4')

        try:
            video_clip = VideoFileClip(video_path)
            audio_clip = AudioFileClip(audio_path)

            video_with_audio = video_clip.set_audio(audio_clip)

            video_with_audio.write_videofile(output_path, codec='libx264', audio_codec='aac')

            return JsonResponse({'video_url': f'/media/video_with_audio.mp4'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def add_sticker_to_video(request):
    if request.method == 'POST':
        try:
            video_file = request.FILES['file']
            sticker_file = request.FILES['sticker_url']
            position_x = int(request.POST['position_x'])
            position_y = int(request.POST['position_y'])

            video_temp_path = '/tmp/uploaded_video.mp4'
            sticker_temp_path = '/tmp/uploaded_sticker.gif'

            with open(video_temp_path, 'wb+') as destination:
                for chunk in video_file.chunks():
                    destination.write(chunk)

            with open(sticker_temp_path, 'wb+') as destination:
                for chunk in sticker_file.chunks():
                    destination.write(chunk)

            video = VideoFileClip(video_temp_path)

            sticker = VideoFileClip(sticker_temp_path)

            sticker = sticker.loop(duration=video.duration)

            sticker = sticker.set_position((position_x, position_y))

            video_with_sticker = CompositeVideoClip([video, sticker])

            output_filename = 'video_with_sticker.mp4'
            output_file_path = os.path.join(settings.MEDIA_ROOT, output_filename)

            video_with_sticker.write_videofile(output_file_path, codec='libx264', audio_codec='aac')

            return JsonResponse({'video_url': f'{settings.MEDIA_URL}{output_filename}'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')
    user = authenticate(request, username=email, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(instance=user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"Created user: {user}")

            tokens = get_tokens_for_user(user)
            return JsonResponse({'tokens': tokens, 'user': serializer.data}, status=201)
        else:
            logger.error(f"Serializer validation errors: {serializer.errors}")
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data['refresh_token']

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"message": "Đăng xuất thành công."}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_projects(request):
    user = request.user
    projects = Project.objects.filter(user=user, is_delete=False)
    serializer = ProjectSerializer(projects, many=True)
    return Response({'projects': serializer.data}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    user = request.user
    project_name = now().strftime("%Y-%m-%d")

    if not project_name:
        return Response({'error': 'Project name is required'}, status=400)

    project = Project.objects.create(user=user, name=project_name)

    serializer = ProjectSerializer(project)
    return Response({'project': serializer.data}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_audios(request, category):
    audios = Audio.objects.filter(category=category, is_delete=False)
    serializer = AudioSerializer(audios, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_texts(request, category):
    texts = Text.objects.filter(category=category, is_delete=False)
    serializer = TextSerializer(texts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stickers(request, category):
    stickers = Sticker.objects.filter(category=category, is_delete=False)
    serializer = StickerSerializer(stickers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_effects(request, category):
    effects = Effect.objects.filter(category=category, is_delete=False)
    serializer = EffectSerializer(effects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_filters(request, category):
    filters = Filter.objects.filter(category=category, is_delete=False)
    serializer = FilterSerializer(filters, many=True)
    return Response(serializer.data)

