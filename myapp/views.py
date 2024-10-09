from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, FileResponse
from django.contrib.auth import authenticate
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, AudioFileClip, ImageClip, ImageSequenceClip, ColorClip
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
from PIL import Image
from io import BytesIO
from final_web.settings import supabase
from .serializers import *
from rest_framework import status
from moviepy.editor import CompositeAudioClip
import moviepy.editor as mp
import numpy as np
import os
import json
import logging
import requests
import tempfile
import cv2


os.environ['TMPDIR'] = '/home/khanh123/my_temp'
def home(request):
    return render(request, 'home.html')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_video(request):
    try:
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_videos(request, project):
    try:
        videos = Video.objects.filter(project=project, is_delete=False)
        if not videos.exists():
            return JsonResponse({'message': 'No videos found for this project'}, status=404)

        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_edit_session(request):
    user = request.user
    project_id = request.data.get('project_id')
    actions = request.data.get('actions')

    edit_session, created = EditSession.objects.get_or_create(user=user, project_id=project_id)

    if not created:
        edit_session.actions = actions
        edit_session.save()

    return Response({'message': 'Edit session saved successfully'}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_edit_session(request, project_id):
    try:
        logger.info(f"Fetching edit session for project {project_id}")
        user = request.user
        project = Project.objects.get(id=project_id)
        edit_session = EditSession.objects.filter(user=user, project=project).first()

        if edit_session:
            serializer = EditSessionSerializer(edit_session)
            logger.info(f"Edit session found for project {project_id}")
            return Response(serializer.data, status=200)
        else:
            logger.info(f"No edit session found for project {project_id}")
            return Response({'message': 'No edit session found for this project', 'actions': {}}, status=200)
    except Project.DoesNotExist:
        logger.error(f"Project {project_id} does not exist")
        return Response({'error': 'Project does not exist'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching edit session: {e}")
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_token(request):
    return Response({"message": "Token is valid"}, status=200)


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

            text_clip = TextClip(text_to_add, fontsize=70, color='white').set_position(
                ('center', 'bottom')).set_duration(video.duration)

            video_with_text = CompositeVideoClip([video, text_clip])

            video_with_text.write_videofile(output_file_path)

            return JsonResponse({'video_url': f'{settings.MEDIA_URL}{output_filename}'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

def apply_custom_effects(frame, config):
    
    brightness = config.get('brightness', 1.0)  
    contrast = config.get('contrast', 1.0)  
    hue_shift = config.get('color_tone', {}).get('hue_shift', 0)  

    
    frame = np.clip(frame * brightness, 0, 255).astype(np.uint8)

    
    frame = np.clip(contrast * (frame - 128) + 128, 0, 255).astype(np.uint8)

    
    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)
    hsv_frame[:, :, 0] = (hsv_frame[:, :, 0] + hue_shift) % 180  
    frame = cv2.cvtColor(hsv_frame, cv2.COLOR_HSV2RGB)

    return frame

def apply_effect_in_time_range(clip, config, start_time, end_time):
    effect_clip = clip.subclip(start_time, end_time).fl_image(lambda frame: apply_custom_effects(frame, config))
    return effect_clip.set_start(start_time)

def apply_color_tone(clip, hue_shift=0, shadow_tint=[0, 0, 0], highlight_tint=[255, 255, 255]):
    shadow_tint = np.array(shadow_tint) / 255.0
    highlight_tint = np.array(highlight_tint) / 255.0

    def process_frame(frame):
        frame = frame / 255.0

        mask = frame.mean(axis=2, keepdims=True)  
        tinted_frame = np.where(mask < 0.5, frame * shadow_tint, frame * highlight_tint)

        
        if hue_shift != 0:
            tinted_frame = np.roll(tinted_frame, shift=int(hue_shift), axis=2)  

        
        return np.clip(tinted_frame * 255, 0, 255).astype(np.uint8)

    
    return clip.fl_image(process_frame)

def apply_contrast(clip, contrast=1.0):
    def adjust_contrast(image):
        
        return np.clip(128 + contrast * (image - 128), 0, 255).astype(np.uint8)
    return clip.fl_image(adjust_contrast)

def apply_brightness(clip, brightness=1.0):
    def adjust_brightness(image):
        
        return np.clip(image * brightness, 0, 255).astype(np.uint8)
    return clip.fl_image(adjust_brightness)

def apply_saturation(clip, saturation=1.0):
    def adjust_saturation(image):
        grayscale_image = np.dot(image[...,:3], [0.2989, 0.587, 0.114])  
        grayscale_image = np.stack([grayscale_image] * 3, axis=-1)  
        return np.clip(grayscale_image * (1 - saturation) + image * saturation, 0, 255).astype(np.uint8)
    return clip.fl_image(adjust_saturation)

def apply_filter_in_time_range(clip, config, start_time, end_time):
    
    sub_clip = clip.subclip(start_time, end_time)

    
    contrast = config.get('contrast', {}).get('default', 1)
    brightness = config.get('brightness', {}).get('default', 1)
    saturation = config.get('saturation', {}).get('default', 1)

    color_tone = config.get('color_tone', {})
    hue_shift = color_tone.get('hue_shift', {}).get('default', 0)
    shadow_tint = color_tone.get('shadow_tint', {}).get('default', [0, 0, 0])
    highlight_tint = color_tone.get('highlight_tint', {}).get('default', [255, 255, 255])

    
    if contrast != 1:
        sub_clip = apply_contrast(sub_clip, contrast)

    if brightness != 1:
        sub_clip = apply_brightness(sub_clip, brightness)

    if saturation != 1:
        sub_clip = apply_saturation(sub_clip, saturation)

    if hue_shift != 0 or shadow_tint != [0, 0, 0] or highlight_tint != [255, 255, 255]:
        sub_clip = sub_clip.fx(apply_color_tone, hue_shift=hue_shift, shadow_tint=shadow_tint, highlight_tint=highlight_tint)

    return sub_clip

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_video(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))  
        video_width, video_height = 1280, 720  

        
        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration)

        videos_data = request.POST.getlist('videos')
        videos = [json.loads(video_data) for video_data in videos_data]

        audios_data = request.POST.getlist('audios')
        audios = [json.loads(audio_data) for audio_data in audios_data]

        texts_data = request.POST.getlist('texts')
        texts = [json.loads(text_data) for text_data in texts_data]

        stickers_data = request.POST.getlist('stickers')
        stickers = [json.loads(sticker_data) for sticker_data in stickers_data]

        effects_data = request.POST.getlist('effects')
        effects = [json.loads(effect_data) for effect_data in effects_data]

        filters_data = request.POST.getlist('filters')
        filters = [json.loads(filter_data) for filter_data in filters_data]

        
        print(f"Received videos: {videos}")
        print(f"Received audios: {audios}")
        print(f"Received texts: {texts}")
        print(f"Received stickers: {stickers}")
        print(f"Received effects: {effects}")
        print(f"Received filters: {filters}")

        
        try:
            texts = json.loads(texts) if isinstance(texts, str) else texts
            stickers = json.loads(stickers) if isinstance(stickers, str) else stickers
            effects = json.loads(effects) if isinstance(effects, str) else effects
            filters = json.loads(filters) if isinstance(filters, str) else filters
        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'Error decoding JSON: {str(e)}'}, status=400)


        video_clips = []
        for video in videos:
            url = video.get('url')
            startTime = float(video.get('startTime', 0.0))
            endTime = float(video.get('endTime', 0.0))
            duration = float(video.get('duration', 5.0))

            response = requests.get(url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path).subclip(0, duration)
            video_clip = video_clip.set_start(startTime)
            video_clips.append(video_clip)  

            
        final_clip = CompositeVideoClip([black_clip] + video_clips)

        original_audio = final_clip.audio

        audio_clips = [original_audio]


        for audio in audios:
            url = audio.get('url')
            startTime = float(audio.get('startTime', 0.0))
            endTime = float(audio.get('endTime', 0.0))
            duration = float(audio.get('duration', 5.0))


            response = requests.get(url)
            audio_file = BytesIO(response.content)


            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
                temp_audio.write(audio_file.getvalue())
                audio_path = temp_audio.name


            audio_clip = AudioFileClip(audio_path).subclip(0, duration)


            audio_clip = audio_clip.set_start(startTime)


            audio_clips.append(audio_clip)

        final_audio = CompositeAudioClip(audio_clips)
        final_clip = final_clip.set_audio(final_audio)

        for filter_data in filters:
            config = filter_data.get('config', {})
            startTime = float(filter_data.get('startTime', 0.0))
            endTime = float(filter_data.get('endTime', 0.0))
            duration = endTime - startTime


            contrast = config.get('contrast', {}).get('default', 1)
            brightness = config.get('brightness', {}).get('default', 1)
            saturation = config.get('saturation', {}).get('default', 1)

            color_tone = config.get('color_tone', {})
            hue_shift = color_tone.get('hue_shift', {}).get('default', 0)
            shadow_tint = color_tone.get('shadow_tint', {}).get('default', [0, 0, 0])
            highlight_tint = color_tone.get('highlight_tint', {}).get('default', [255, 255, 255])


            subclip = final_clip.subclip(startTime, endTime)


            if contrast != 1:
                subclip = apply_contrast(subclip, contrast)

            if brightness != 1:
                subclip = apply_brightness(subclip, brightness)

            if saturation != 1:
                subclip = apply_saturation(subclip, saturation)

            if hue_shift != 0 or shadow_tint != [0, 0, 0] or highlight_tint != [255, 255, 255]:
                subclip = subclip.fx(apply_color_tone, hue_shift=hue_shift, shadow_tint=shadow_tint,
                                     highlight_tint=highlight_tint)


            final_clip = concatenate_videoclips(
                [final_clip.subclip(0, startTime), subclip, final_clip.subclip(endTime)])

        for text in texts:
            content = text.get('content', "Default")
            style = text.get('style', {})
            color = style.get('color', '#FFFFFF')
            fontSize = int(style.get('fontSize', 20))
            position = float(text.get('position', 0.0))
            startTime = float(text.get('startTime', 0.0))
            endTime = float(text.get('endTime', 0.0))
            duration = float(text.get('duration', 5.0))
            text_clip = TextClip(
                content,
                fontsize=fontSize,
                color=color
            ).set_position(('center', 'center')).set_start(startTime).set_duration(duration)
            final_clip = CompositeVideoClip([final_clip, text_clip])

        for sticker in stickers:
            url = sticker.get('url')
            print(url)
            startTime = float(sticker.get('startTime', 0.0))
            endTime = float(sticker.get('endTime', 0.0))
            duration = float(sticker.get('duration', 5.0))

            response = requests.get(url)
            print(f"GIF response status: {response.status_code}")
            sticker_bytes = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".gif") as temp_gif:
                temp_gif.write(sticker_bytes.getbuffer())
                temp_gif_path = temp_gif.name


            sticker_clip = VideoFileClip(temp_gif_path, has_mask=True)
            repeat_count = int(duration // sticker_clip.duration) + 1
            print(repeat_count)
            sticker_clips = []  
            for i in range(repeat_count):
                sticker_clip = VideoFileClip(temp_gif_path, has_mask=True)
                loop_start_time = startTime + i * sticker_clip.duration
                loop_end_time = endTime + i * sticker_clip.duration
                if i == repeat_count - 1:
                    sticker_copy = sticker_clip.copy().set_position(('center', 'center')).set_start(
                    loop_start_time).set_duration(endTime - loop_start_time)
                else:
                    sticker_copy = sticker_clip.copy().set_position(('center', 'center')).set_start(
                        loop_start_time).set_duration(sticker_clip.duration)
                    print(f'i: {i}')
                    print(f'loop_start_time: {loop_start_time}')
                    print(f'sticker_copy: {sticker_copy}')
                sticker_clips.append(sticker_copy)



            
            final_clip = CompositeVideoClip([final_clip] + sticker_clips)

            os.remove(temp_gif_path)

        for effect in effects:
            config = effect.get('config', {})
            startTime = float(effect.get('startTime', 0.0))
            endTime = float(effect.get('endTime', 0.0))
            duration = float(effect.get('duration', 5.0))

            effect_clip = apply_effect_in_time_range(final_clip, config, startTime, endTime)
            final_clip = CompositeVideoClip([final_clip, effect_clip])

        output_filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, output_filename)
        final_clip.write_videofile(output_file_path, codec='libx264')

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{output_filename}'})

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

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

        role = serializer.data['role']
        if role == 'admin':
            redirect_url = '/admin'
        else:
            redirect_url = '/user'

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data,
            'redirect_url': redirect_url
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_audio(request):
    try:
        serializer = AudioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_audios(request):
    audios = Audio.objects.filter(is_delete=False)
    serializer = AudioSerializer(audios, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_audios(request, category):
    audios = Audio.objects.filter(category=category, is_delete=False)
    serializer = AudioSerializer(audios, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_audio_by_id(request, audioId):
    audios = Audio.objects.filter(id=audioId, is_delete=False)
    serializer = AudioSerializer(audios, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_audio(request, audioId):
    try:
        audio = Audio.objects.get(id=audioId, is_delete=False)
    except Audio.DoesNotExist:
        return JsonResponse({'error': 'Audio not found'}, status=404)

    serializer = AudioSerializer(audio, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_audio(request):
    audioId = request.data.get('audioId')
    try:
        audio = Audio.objects.get(id=audioId, is_delete=False)
    except Audio.DoesNotExist:
        return JsonResponse({'error': 'Audio not found'}, status=404)

    audio.is_delete = True
    audio.save()

    return JsonResponse({'message': 'Audio deleted successfully'}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_text(request):
    try:
        serializer = TextSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_texts(request):
    texts = Text.objects.filter(is_delete=False)
    serializer = TextSerializer(texts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_texts(request, category):
    texts = Text.objects.filter(category=category, is_delete=False)
    serializer = TextSerializer(texts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_text_by_id(request, textId):
    text = Text.objects.filter(id=textId, is_delete=False)
    serializer = TextSerializer(text, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_text(request, textId):
    try:
        text = Text.objects.get(id=textId, is_delete=False)
    except Text.DoesNotExist:
        return JsonResponse({'error': 'Text not found'}, status=404)

    serializer = TextSerializer(text, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_text(request):
    textId = request.data.get('textId')
    try:
        text = Text.objects.get(id=textId, is_delete=False)
    except Text.DoesNotExist:
        return JsonResponse({'error': 'Text not found'}, status=404)

    text.is_delete = True
    text.save()

    return JsonResponse({'message': 'Text deleted successfully'}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_sticker(request):
    sticker_url = request.data.get('sticker_file')

    if not sticker_url:
        return JsonResponse({'error': 'No sticker URL provided'}, status=400)
    try:
        response = requests.get(sticker_url)
        response.raise_for_status()

        sticker_file = BytesIO(response.content)

        with Image.open(sticker_file) as img:
            duration = 0
            for frame in range(0, img.n_frames):
                img.seek(frame)
                duration += (img.info['duration']) / 1000
        data = request.data.copy()
        data['duration'] = duration
        serializer = StickerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_stickers(request):
    stickers = Sticker.objects.filter(is_delete=False)
    serializer = StickerSerializer(stickers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stickers(request, category):
    stickers = Sticker.objects.filter(category=category, is_delete=False)
    serializer = StickerSerializer(stickers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sticker_by_id(request, stickerId):
    sticker = Sticker.objects.filter(id=stickerId, is_delete=False)
    serializer = StickerSerializer(sticker, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_sticker(request, stickerId):
    try:
        sticker = Sticker.objects.get(id=stickerId, is_delete=False)
    except Sticker.DoesNotExist:
        return JsonResponse({'error': 'Sticker not found'}, status=404)

    serializer = StickerSerializer(sticker, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_sticker(request):
    stickerId = request.data.get('stickerId')
    try:
        sticker = Sticker.objects.get(id=stickerId, is_delete=False)
    except Sticker.DoesNotExist:
        return JsonResponse({'error': 'Sticker not found'}, status=404)

    sticker.is_delete = True
    sticker.save()

    return JsonResponse({'message': 'Sticker deleted successfully'}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_effect(request):
    try:
        serializer = EffectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_effects(request):
    effects = Effect.objects.filter(is_delete=False)
    serializer = EffectSerializer(effects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_effects(request, category):
    effects = Effect.objects.filter(category=category, is_delete=False)
    serializer = EffectSerializer(effects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_effect_by_id(request, effectId):
    effect = Effect.objects.filter(id=effectId, is_delete=False)
    serializer = EffectSerializer(effect, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_effect(request, effectId):
    try:
        effect = Effect.objects.get(id=effectId, is_delete=False)
    except Effect.DoesNotExist:
        return JsonResponse({'error': 'Effect not found'}, status=404)

    serializer = EffectSerializer(effect, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_effect(request):
    effectId = request.data.get('effectId')
    try:
        effect = Effect.objects.get(id=effectId, is_delete=False)
    except Effect.DoesNotExist:
        return JsonResponse({'error': 'Effect not found'}, status=404)

    effect.is_delete = True
    effect.save()

    return JsonResponse({'message': 'Effect deleted successfully'}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_filter(request):
    try:
        serializer = FilterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_filters(request):
    filters = Filter.objects.filter(is_delete=False)
    serializer = FilterSerializer(filters, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_filters(request, category):
    filters = Filter.objects.filter(category=category, is_delete=False)
    serializer = FilterSerializer(filters, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_filter_by_id(request, filterId):
    filter = Filter.objects.filter(id=filterId, is_delete=False)
    serializer = FilterSerializer(filter, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_filter(request, filterId):
    try:
        filter = Filter.objects.get(id=filterId, is_delete=False)
    except Filter.DoesNotExist:
        return JsonResponse({'error': 'Filter not found'}, status=404)

    serializer = FilterSerializer(filter, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_filter(request):
    filterId = request.data.get('filterId')
    try:
        filter = Filter.objects.get(id=filterId, is_delete=False)
    except Filter.DoesNotExist:
        return JsonResponse({'error': 'Filter not found'}, status=404)

    filter.is_delete = True
    filter.save()

    return JsonResponse({'message': 'Filter deleted successfully'}, status=201)
