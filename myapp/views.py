from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, FileResponse
from django.contrib.auth import authenticate
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, AudioFileClip, ImageClip
from moviepy.config import change_settings
from tempfile import NamedTemporaryFile
from django.views.decorators.csrf import csrf_exempt
from tempfile import NamedTemporaryFile
from django.conf import settings
from .models import Video
import os
import json
import logging

# Create your views here.

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
            sticker_file = request.FILES['sticker_url']  # Sticker image file (GIF động)
            position_x = int(request.POST['position_x'])  # X coordinate for sticker placement
            position_y = int(request.POST['position_y'])  # Y coordinate for sticker placement

            # Temporary paths to save uploaded files
            video_temp_path = '/tmp/uploaded_video.mp4'
            sticker_temp_path = '/tmp/uploaded_sticker.gif'

            # Save the video file temporarily
            with open(video_temp_path, 'wb+') as destination:
                for chunk in video_file.chunks():
                    destination.write(chunk)

            # Save the sticker file temporarily
            with open(sticker_temp_path, 'wb+') as destination:
                for chunk in sticker_file.chunks():
                    destination.write(chunk)

            # Load the video
            video = VideoFileClip(video_temp_path)

            # Load the sticker GIF as a VideoFileClip
            sticker = VideoFileClip(sticker_temp_path)

            # Make the sticker loop continuously during the entire video
            sticker = sticker.loop(duration=video.duration)

            # Set the position of the sticker
            sticker = sticker.set_position((position_x, position_y))

            # Composite the sticker onto the video
            video_with_sticker = CompositeVideoClip([video, sticker])

            # Output file path
            output_filename = 'video_with_sticker.mp4'
            output_file_path = os.path.join(settings.MEDIA_ROOT, output_filename)

            # Write the final video with the sticker
            video_with_sticker.write_videofile(output_file_path, codec='libx264', audio_codec='aac')

            # Return the video URL
            return JsonResponse({'video_url': f'{settings.MEDIA_URL}{output_filename}'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

