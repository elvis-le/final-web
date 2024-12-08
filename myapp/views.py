import urllib
from datetime import timedelta

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, FileResponse
from django.contrib.auth import authenticate
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from moviepy.editor import CompositeAudioClip, VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, AudioFileClip, ImageClip, ImageSequenceClip, ColorClip
from moviepy.config import change_settings
from django.views.decorators.csrf import csrf_exempt
from tempfile import NamedTemporaryFile
from django.utils.timezone import now
from moviepy.video.fx.colorx import colorx
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from PIL import Image, ImageFilter, ImageDraw, ImageFont
from io import BytesIO
from .serializers import *
from rest_framework import status
from moviepy.video.fx.resize import resize
from moviepy.video.fx.rotate import rotate
from django.shortcuts import get_object_or_404
from moviepy.video.fx import all as vfx
from django.core.mail import send_mail
import numpy as np
import os
import json
import logging
import tempfile
import cv2
from pydub import AudioSegment

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


def apply_effect_in_time_range(clip, config, startTime, endTime):
    effect_name = config.get('name', 'default')
    print(f"Effect {effect_name} applied from {startTime} to {endTime}")

    subclip = clip.subclip(startTime, endTime)

    if effect_name == 'blur':
        subclip = apply_blur_effect(clip, config, startTime, endTime)
    elif effect_name == 'glitch':
        subclip = apply_glitch_effect(clip, config, startTime, endTime)
    elif effect_name == 'tilt_shift':
        subclip = apply_tilt_shift_effect(clip, config, startTime, endTime)
    elif effect_name == 'invert_colors':
        subclip = apply_invert_colors_effect(clip, config, startTime, endTime)
    elif effect_name == 'sepia_tone':
        subclip = apply_sepia_tone_effect(clip, config, startTime, endTime)
    elif effect_name == 'pixelate':
        subclip = apply_pixelate_effect(clip, config, startTime, endTime)
    elif effect_name == 'hue_rotate':
        subclip = apply_hue_rotate_effect(clip, config, startTime, endTime)
    elif effect_name == 'lens_zoom':
        subclip = apply_lens_zoom_effect(clip, config, startTime, endTime)
    elif effect_name == 'zoom_in_out':
        subclip = apply_zoom_in_out_effect(clip, config, startTime, endTime)
    elif effect_name == 'shake':
        subclip = apply_shake_effect(clip, config, startTime, endTime)
    elif effect_name == 'old_film':
        subclip = apply_old_film_effect(clip, config, startTime, endTime)
    elif effect_name == 'ripple_effect':
        subclip = apply_ripple_effect(clip, config, startTime, endTime)
    elif effect_name == 'radial_zoom':
        subclip = apply_radial_zoom_effect(clip, config, startTime, endTime)
    elif effect_name == 'ghost_effect':
        subclip = apply_ghost_effect(clip, config, startTime, endTime)
    elif effect_name == 'zoom_blur':
        subclip = apply_zoom_blur_effect(clip, config, startTime, endTime)
    elif effect_name == 'color_shift':
        subclip = apply_color_shift_effect(clip, config, startTime, endTime)
    elif effect_name == 'echo_effect':
        subclip = apply_echo_effect(clip, config, startTime, endTime)

    final_clip = CompositeVideoClip([clip, subclip.set_start(startTime)])

    return final_clip


def apply_blur_effect(clip, config, startTime, endTime):
    blur_value = 61
    print(f"Applying blur with value: {blur_value} from {startTime} to {endTime}")

    if blur_value % 2 == 0:
        blur_value += 1
    if blur_value <= 0:
        blur_value = 1

    def blur_frame(frame):

        if frame.dtype != 'uint8':
            frame = (frame * 255).astype('uint8')

        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        for _ in range(3):
            frame_bgr = cv2.GaussianBlur(frame_bgr, (blur_value, blur_value), 0)

        blurred_frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)

        return blurred_frame_rgb

    blur_clip = clip.fl_image(blur_frame)

    return blur_clip.subclip(startTime, endTime)


def apply_glitch_effect(clip, config, startTime, endTime):
    min_x = config.get('min_x', -20)
    max_x = config.get('max_x', 20)
    min_skewX = config.get('min_skewX', -10)
    max_skewX = config.get('max_skewX', 10)
    min_hue = config.get('min_hue', 0)
    max_hue = config.get('max_hue', 360)

    def glitch_frame(get_frame, t):
        frame = get_frame(t)
        shift_x = np.random.randint(min_x, max_x)
        skew_x = np.random.randint(min_skewX, max_skewX)
        hue_shift = np.random.randint(min_hue, max_hue)

        frame = np.roll(frame, shift_x, axis=1)
        return frame

    glitch_clip = clip.fl(glitch_frame)
    return glitch_clip


def apply_tilt_shift_effect(clip, config, startTime, endTime):
    blur_value = config.get('blur', 10)
    clipPath = config.get('clipPath', None)

    def apply_clip_path_dynamic(frame, progress):
        height, width = frame.shape[:2]
        mask = np.ones_like(frame) * 255

        if clipPath:
            top_inset = 0.6 * progress
            bottom_inset = 0.6 * progress

            mask[:int(height * top_inset), :] = 0
            mask[int(height * (1 - bottom_inset)):, :] = 0

        return cv2.bitwise_and(frame, mask)

    def tilt_shift_frame(get_frame, t):
        frame = get_frame(t)

        if not isinstance(frame, np.ndarray):
            frame = np.array(frame)

        progress = (t - startTime) / (endTime - startTime)
        progress = max(0, min(1, progress))

        blurred_frame = cv2.GaussianBlur(frame, (blur_value, blur_value), 0)

        if clipPath:
            blurred_frame = apply_clip_path_dynamic(blurred_frame, progress)

        return blurred_frame

    tilt_shift_clip = clip.fl(tilt_shift_frame)

    return tilt_shift_clip.subclip(startTime, endTime)


def apply_invert_colors_effect(clip, config, startTime, endTime):
    def invert_frame(frame):
        return 255 - frame

    inverted_clip = clip.fl_image(invert_frame)
    return inverted_clip.subclip(startTime, endTime)


def apply_pixelate_effect(clip, config, startTime, endTime):
    def pixelate_frame(frame):
        small_frame = cv2.resize(frame, (16, 16), interpolation=cv2.INTER_NEAREST)
        return cv2.resize(small_frame, (frame.shape[1], frame.shape[0]), interpolation=cv2.INTER_NEAREST)

    pixelated_clip = clip.fl_image(pixelate_frame)
    return pixelated_clip.subclip(startTime, endTime)


def apply_sepia_tone_effect(clip, config, startTime, endTime):
    def sepia_frame(frame):
        sepia_filter = np.array([[0.393, 0.769, 0.189],
                                 [0.349, 0.686, 0.168],
                                 [0.272, 0.534, 0.131]])
        return cv2.transform(frame, sepia_filter)

    sepia_clip = clip.fl_image(sepia_frame)
    return sepia_clip.subclip(startTime, endTime)


def apply_hue_rotate_effect(clip, config, startTime, endTime):
    hue_value = config.get('hue', 180)

    def hue_rotate_frame(frame):
        hsv = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)
        hsv[..., 0] = (hsv[..., 0] + hue_value) % 180
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    hue_rotated_clip = clip.fl_image(hue_rotate_frame)
    return hue_rotated_clip.subclip(startTime, endTime)


def apply_ghost_effect(clip, config, startTime, endTime):
    blur_value = 61
    opacity = 0.3
    darkness = config.get('darkness', 0.5)
    yoyo = config.get('yoyo', False)
    repeat = config.get('repeat', 0)

    if blur_value % 2 == 0:
        blur_value += 1
    if blur_value <= 0:
        blur_value = 1

    def ghost_effect_frame(frame):
        print(f"Frame dtype: {frame.dtype}, shape: {frame.shape}")

        if frame.dtype != 'uint8':
            frame = (frame * 255).astype('uint8')

        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        blurred_frame_bgr = cv2.GaussianBlur(frame_bgr, (blur_value, blur_value), 0)
        blurred_frame_rgb = cv2.cvtColor(blurred_frame_bgr, cv2.COLOR_BGR2RGB)

        blended_frame = cv2.addWeighted(blurred_frame_rgb, 1 - opacity, frame, opacity, 0)

        darkened_frame = (blended_frame * darkness).clip(0, 255).astype('uint8')
        return darkened_frame

    ghost_clip = clip.fl_image(ghost_effect_frame)

    if yoyo:
        reversed_clip = ghost_clip.fx(vfx.time_mirror)
        ghost_clip = concatenate_videoclips([ghost_clip, reversed_clip])

    return ghost_clip.subclip(startTime, endTime)


def apply_lens_zoom_effect(clip, config, startTime, endTime):
    zoom_level = config.get('zoom_level', 1.5)

    def zoom_frame(get_frame, t):
        frame = get_frame(t)
        center_x, center_y = frame.shape[1] // 2, frame.shape[0] // 2
        zoom_matrix = cv2.getRotationMatrix2D((center_x, center_y), 0, zoom_level)
        return cv2.warpAffine(frame, zoom_matrix, (frame.shape[1], frame.shape[0]))

    zoom_clip = clip.fl(zoom_frame)
    return zoom_clip.subclip(startTime, endTime)


def apply_shake_effect(clip, config, startTime, endTime):
    def shake_frame(get_frame, t):
        frame = get_frame(t)
        shift_x = np.random.randint(-5, 5)
        shift_y = np.random.randint(-5, 5)
        return np.roll(frame, shift_x, axis=1), np.roll(frame, shift_y, axis=0)

    shake_clip = clip.fl(shake_frame)
    return shake_clip.subclip(startTime, endTime)


def apply_old_film_effect(clip, config, startTime, endTime):
    def old_film_frame(get_frame, t):
        frame = get_frame(t)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
        frame = cv2.convertScaleAbs(frame, alpha=0.6)
        return frame

    old_film_clip = clip.fl_image(old_film_frame)
    return old_film_clip.subclip(startTime, endTime)


def apply_zoom_in_out_effect(clip, config, startTime, endTime):
    zoom_level = config.get('zoom_level', 1.5)

    def zoom_frame(get_frame, t):
        frame = get_frame(t)
        center_x, center_y = frame.shape[1] // 2, frame.shape[0] // 2
        zoom_matrix = cv2.getRotationMatrix2D((center_x, center_y), 0, zoom_level)
        return cv2.warpAffine(frame, zoom_matrix, (frame.shape[1], frame.shape[0]))

    zoom_clip = clip.fl(zoom_frame)
    return zoom_clip.subclip(startTime, endTime)


def apply_zoom_blur_effect(clip, config, startTime, endTime):
    blur_value = config.get('blur', 10)

    def zoom_blur_frame(frame):
        frame_blur = cv2.GaussianBlur(frame, (blur_value, blur_value), 0)
        return frame_blur

    zoom_blur_clip = clip.fl_image(zoom_blur_frame)
    return zoom_blur_clip.subclip(startTime, endTime)


def apply_color_shift_effect(clip, config, startTime, endTime):
    hue_shift_value = 60

    def color_shift_frame(frame):
        hsv = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)
        hsv[..., 0] = (hsv[..., 0] + hue_shift_value) % 180
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    color_shift_clip = clip.fl_image(color_shift_frame)
    return color_shift_clip.subclip(startTime, endTime)


def apply_echo_effect(clip, config, startTime, endTime):
    def echo_frame(get_frame, t):
        frame = get_frame(t)
        return cv2.addWeighted(frame, 0.5, frame, 0.5, 0)

    echo_clip = clip.fl_image(echo_frame)
    return echo_clip.subclip(startTime, endTime)


def apply_ripple_effect(clip, config, startTime, endTime):
    def ripple_frame(get_frame, t):
        frame = get_frame(t)
        rows, cols, _ = frame.shape
        ripple_center_x, ripple_center_y = cols // 2, rows // 2

        for i in range(rows):
            offset_x = int(25.0 * np.sin(2 * np.pi * i / 50.0))
            frame[i, :] = np.roll(frame[i, :], offset_x, axis=0)

        return frame

    ripple_clip = clip.fl(ripple_frame)
    return ripple_clip.subclip(startTime, endTime)


def apply_radial_zoom_effect(clip, config, startTime, endTime):
    def radial_zoom_frame(get_frame, t):
        frame = get_frame(t)
        center_x, center_y = frame.shape[1] // 2, frame.shape[0] // 2
        zoom_matrix = cv2.getRotationMatrix2D((center_x, center_y), 0, 1.5)
        return cv2.warpAffine(frame, zoom_matrix, (frame.shape[1], frame.shape[0]))

    radial_zoom_clip = clip.fl(radial_zoom_frame)
    return radial_zoom_clip.subclip(startTime, endTime)


def apply_filter_in_time_range(clip, config, startTime, endTime):
    filter_name = config.get('name', 'default')
    print(f"Filter {filter_name} applied from {startTime} to {endTime}")

    subclip = clip.subclip(startTime, endTime)

    if filter_name == 'vibrant':
        subclip = vibrant_filter(clip, config, startTime, endTime)
    elif filter_name == 'crisp':
        subclip = crisp_filter(clip, config, startTime, endTime)
    elif filter_name == 'bright_life':
        subclip = bright_life_filter(clip, config, startTime, endTime)
    elif filter_name == 'faded':
        subclip = faded_filter(clip, config, startTime, endTime)
    elif filter_name == 'blue_sky':
        subclip = blue_sky_filter(clip, config, startTime, endTime)
    elif filter_name == 'dreamy':
        subclip = dreamy_filter(clip, config, startTime, endTime)
    elif filter_name == 'enhance':
        subclip = enhance_filter(clip, config, startTime, endTime)
    elif filter_name == 'highlight':
        subclip = highlight_filter(clip, config, startTime, endTime)
    elif filter_name == 'fresh':
        subclip = fresh_filter(clip, config, startTime, endTime)
    elif filter_name == 'sunny':
        subclip = sunny_filter(clip, config, startTime, endTime)
    elif filter_name == 'cinematic':
        subclip = cinematic_filter(clip, config, startTime, endTime)
    elif filter_name == 'dramatic':
        subclip = dramatic_filter(clip, config, startTime, endTime)
    elif filter_name == 'film_noir':
        subclip = film_noir_filter(clip, config, startTime, endTime)
    elif filter_name == 'gritty':
        subclip = gritty_filter(clip, config, startTime, endTime)
    elif filter_name == 'muted':
        subclip = muted_filter(clip, config, startTime, endTime)
    elif filter_name == 'sepia':
        subclip = sepia_filter(clip, config, startTime, endTime)
    elif filter_name == 'vintage':
        subclip = enhance_filter(clip, config, startTime, endTime)
    elif filter_name == 'green_boost':
        subclip = green_boost_filter(clip, config, startTime, endTime)
    elif filter_name == 'nature_boost':
        subclip = nature_boost_filter(clip, config, startTime, endTime)
    elif filter_name == 'sunrise':
        subclip = sunrise_filter(clip, config, startTime, endTime)
    elif filter_name == 'neon':
        subclip = neon_filter(clip, config, startTime, endTime)
    elif filter_name == 'pastel':
        subclip = pastel_filter(clip, config, startTime, endTime)
    elif filter_name == 'vintage_glow':
        subclip = vintage_glow_filter(clip, config, startTime, endTime)
    elif filter_name == 'soft_focus':
        subclip = soft_focus_filter(clip, config, startTime, endTime)

    final_clip = CompositeVideoClip([clip, subclip.set_start(startTime)])

    return final_clip


def crisp_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.15)
    contrast = params.get("contrast", 1.4)

    clip = colorx(clip, factor=brightness)

    clip = lum_contrast(clip, contrast)

    return clip.subclip(startTime, endTime)


def blue_sky_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    saturation = params.get("saturation", 1.3)
    blue_factor = params.get("blue_factor", 1.5)
    green_factor = params.get("green_factor", 1.2)

    def enhance_blue_sky(frame):
        hsv = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)

        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * saturation, 0, 255)

        enhanced_frame = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

        enhanced_frame[:, :, 2] = np.clip(enhanced_frame[:, :, 2] * blue_factor, 0, 255)
        enhanced_frame[:, :, 1] = np.clip(enhanced_frame[:, :, 1] * green_factor, 0, 255)

        return enhanced_frame.astype(np.uint8)

    return clip.fl_image(enhance_blue_sky).subclip(startTime, endTime)


def adjust_brightness(clip, factor):
    return colorx(clip, factor)


def adjust_hue(clip, hue_shift):
    def hue_transform(frame):
        hsv = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)
        hsv[:, :, 0] = (hsv[:, :, 0] + hue_shift * 180) % 180
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    return clip.fl_image(hue_transform)


def add_grain(clip, intensity=0.3):
    def grain_effect(frame):
        noise = np.random.normal(0, intensity * 255, frame.shape).astype(np.uint8)
        return cv2.addWeighted(frame, 1 - intensity, noise, intensity, 0)

    return clip.fl_image(grain_effect)


def apply_blur(image_array, blur_strength=10):
    img = Image.fromarray(image_array)
    img = img.filter(ImageFilter.GaussianBlur(blur_strength))
    return np.array(img)


def blur(clip, blur_strength=10):
    return clip.fl_image(lambda frame: apply_blur(frame, blur_strength))


def lum_contrast(clip, contrast=1.0):
    def adjust_contrast(image_array):
        factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

        def contrast_pixel(value):
            return 128 + factor * (value - 128)

        return np.clip(contrast_pixel(image_array), 0, 255).astype(np.uint8)

    return clip.fl_image(adjust_contrast)


def enhance_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    color_factor = params.get("color_factor", 1.5)
    clip = colorx(clip, factor=color_factor)
    return clip.subclip(startTime, endTime)


def vintage_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    color_factor = params.get("color_factor", 0.6)
    clip = colorx(clip, factor=color_factor)
    return clip.subclip(startTime, endTime)


def pastel_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    color_factor = params.get("color_factor", 0.9)
    clip = colorx(clip, factor=color_factor)
    return clip.subclip(startTime, endTime)


def highlight_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.3)
    saturation = params.get("saturation", 1.4)
    clip = colorx(clip, factor=brightness)
    clip = colorx(clip, factor=saturation)
    return clip.subclip(startTime, endTime)


def dramatic_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    contrast = params.get("contrast", 1.4)
    color_factor = params.get("color_factor", 0.7)
    clip = lum_contrast(clip, contrast)
    clip = colorx(clip, factor=color_factor)
    return clip.subclip(startTime, endTime)


def sepia_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    color_factor = params.get("color_factor", 0.8)
    saturation = params.get("saturation", 0.6)
    clip = colorx(clip, factor=color_factor)
    clip = colorx(clip, factor=saturation)
    return clip.subclip(startTime, endTime)


def vintage_glow_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.2)
    color_factor = params.get("color_factor", 0.8)
    blur_strength = params.get("blur_strength", 20)
    contrast = params.get("contrast", 1.4)

    clip = colorx(clip, factor=brightness).subclip(startTime, endTime)

    def add_vintage_glow(frame):
        frame = cv2.convertScaleAbs(frame, alpha=contrast, beta=0)
        blurred_frame = cv2.GaussianBlur(frame, (0, 0), blur_strength)

        glow_frame = cv2.addWeighted(frame, 0.7, blurred_frame, 0.3, 0)

        hsv = cv2.cvtColor(glow_frame, cv2.COLOR_RGB2HSV)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * color_factor, 0, 255)
        vintage_glow_frame = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

        return vintage_glow_frame

    return clip.fl_image(add_vintage_glow).subclip(startTime, endTime)


def soft_focus_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    blur_strength = params.get("blur_strength", 15)
    brightness = params.get("brightness", 1.1)
    contrast = params.get("contrast", 1.2)

    def add_soft_focus(frame):
        adjusted_frame = cv2.convertScaleAbs(frame, alpha=contrast, beta=brightness * 50)

        blurred_frame = cv2.GaussianBlur(adjusted_frame, (0, 0), blur_strength)

        soft_focus_frame = cv2.addWeighted(adjusted_frame, 0.6, blurred_frame, 0.4, 0)

        return soft_focus_frame

    return clip.fl_image(add_soft_focus).subclip(startTime, endTime)


def film_noir_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    contrast = params.get("contrast", 1.8)
    saturation = params.get("saturation", 0.2)
    clip = lum_contrast(clip, contrast)
    clip = colorx(clip, factor=saturation)
    return clip.subclip(startTime, endTime)


def faded_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    saturation = params.get("saturation", 0.6)
    brightness = params.get("brightness", 0.9)
    clip = colorx(clip, factor=saturation)
    clip = colorx(clip, factor=brightness)
    return clip.subclip(startTime, endTime)


def dreamy_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    blur_strength = params.get("blur_strength", 15)
    brightness = params.get("brightness", 1.2)
    clip = blur(clip, blur_strength)
    clip = colorx(clip, factor=brightness)
    return clip.subclip(startTime, endTime)


def bright_life_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.5)
    warmth = params.get("warmth", 1.2)
    contrast = params.get("contrast", 1.3)

    clip = colorx(clip, brightness)
    clip = lum_contrast(clip, contrast)
    return clip.fl_image(lambda img: cv2.addWeighted(img, 1, img, warmth - 1, 0)).subclip(startTime, endTime)


def vibrant_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.1)
    saturation = params.get("saturation", 1.4)
    contrast = params.get("contrast", 1.15)

    clip = colorx(clip, brightness)
    return lum_contrast(clip, contrast).fl_image(
        lambda img: cv2.cvtColor(cv2.convertScaleAbs(img, alpha=saturation), cv2.COLOR_BGR2HSV)).subclip(startTime,
                                                                                                         endTime)


def fresh_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.15)
    saturation = params.get("saturation", 1.2)
    contrast = params.get("contrast", 1.05)
    cool_tone = params.get("cool_tone", 0.9)

    clip = colorx(clip, brightness)
    clip = lum_contrast(clip, contrast)
    clip = colorx(clip, cool_tone)
    return clip.subclip(startTime, endTime)


def sunny_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.2)
    warmth = params.get("warmth", 1.3)
    color_factor = params.get("color_factor", 1.05)

    clip = colorx(clip, brightness)
    clip = colorx(clip, warmth)
    clip = colorx(clip, color_factor)
    return clip.subclip(startTime, endTime)


def sunrise_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    brightness = params.get("brightness", 1.1)
    warmth = params.get("warmth", 1.25)
    hue_shift = params.get("hue_shift", 0.05)

    def apply_warm_tone(img):
        hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        hsv[:, :, 0] = np.clip(hsv[:, :, 0] + hue_shift * 10, 0, 180)
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    clip = colorx(clip, brightness)
    return clip.fl_image(apply_warm_tone).subclip(startTime, endTime)


def green_boost_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    saturation = params.get("saturation", 1.3)
    color_factor = params.get("color_factor", 1.2)
    green_intensity = params.get("green_intensity", 1.4)

    clip = colorx(clip, color_factor)
    clip = colorx(clip, saturation)
    clip = colorx(clip, green_intensity)
    return clip.subclip(startTime, endTime)


def nature_boost_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    saturation = params.get("saturation", 1.4)
    green_intensity = params.get("green_intensity", 1.5)

    def apply_green_boost(img):
        hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * saturation, 0, 255)
        hsv[:, :, 0] = np.clip(hsv[:, :, 0] * green_intensity, 0, 255)
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    return clip.fl_image(apply_green_boost).subclip(startTime, endTime)


def muted_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    color_factor = params.get("color_factor", 0.7)
    contrast = params.get("contrast", 0.85)
    brightness = params.get("brightness", 0.9)

    clip = colorx(clip, factor=color_factor)

    clip = lum_contrast(clip, contrast)
    clip = adjust_brightness(clip, brightness)

    return clip.subclip(startTime, endTime)


def cinematic_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    contrast = params.get("contrast", 1.5)
    saturation = params.get("saturation", 0.8)
    brightness = params.get("brightness", 1.05)
    warmth = params.get("warmth", 1.1)
    blue_tone = params.get("blue_tone", 0.9)

    clip = colorx(clip, factor=brightness)
    clip = lum_contrast(clip, contrast)

    def adjust_saturation(frame):
        hsv = cv2.cvtColor(frame, cv2.COLOR_RGB2HSV)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * saturation, 0, 255)
        return cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)

    clip = clip.fl_image(adjust_saturation)

    def apply_cinematic_tone(frame):
        b, g, r = cv2.split(frame)

        r = np.clip(r * warmth, 0, 255).astype(np.uint8)
        b = np.clip(b * blue_tone, 0, 255).astype(np.uint8)

        return cv2.merge((b, g, r))

    clip = clip.fl_image(apply_cinematic_tone)

    return clip.subclip(startTime, endTime)


def gritty_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    contrast = params.get("contrast", 1.8)
    brightness = params.get("brightness", 0.85)
    grain_intensity = params.get("grain_intensity", 0.3)

    clip = lum_contrast(clip, contrast)
    clip = adjust_brightness(clip, brightness)
    clip = add_grain(clip, grain_intensity)
    return clip.subclip(startTime, endTime)


def neon_filter(clip, config, startTime, endTime):
    params = config.get('params', {})
    saturation = params.get("saturation", 1.7)
    contrast = params.get("contrast", 1.25)
    brightness = params.get("brightness", 1.1)
    hue_shift = params.get("hue_shift", 0.1)

    clip = colorx(clip, factor=saturation)
    clip = lum_contrast(clip, contrast)
    clip = adjust_brightness(clip, brightness)
    clip = adjust_hue(clip, hue_shift)
    return clip.subclip(startTime, endTime)

def is_video(url):
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv']
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif']

    _, ext = os.path.splitext(url)
    ext = ext.lower()
    if ext in video_extensions:
        return True
    elif ext in image_extensions:
        return False
    else:
        return None

def download_video(url):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            temp_file = NamedTemporaryFile(delete=False, suffix=".mp4")
            for chunk in response.iter_content(chunk_size=1024):
                temp_file.write(chunk)
            temp_file.close()
            return temp_file.name
        else:
            raise Exception(f"Failed to download video. Status code: {response.status_code}")
    except Exception as e:
        logger.error(f"Error downloading video: {e}")
        raise

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def split_video(request):
    try:
        logger.info("Splitting video started.")
        video_id = request.POST.get("videoId")
        video_position = request.POST.get("videoPosition")
        current_time = float(request.POST.get("currentTime"))

        if not video_id or current_time is None:
            logger.error("Missing videoId or currentTime.")
            return JsonResponse({"error": "Missing videoId or currentTime"}, status=400)

        try:
            video = Video.objects.get(id=video_id)
        except Video.DoesNotExist:
            logger.error(f"Video with ID {video_id} not found.")
            return JsonResponse({"error": "Video not found"}, status=404)

        video_url = video.video_url
        logger.info(f"Video URL: {video_url}")


        local_video_path = download_video(video_url)
        logger.info(f"Downloaded video to {local_video_path}")


        with VideoFileClip(local_video_path) as clip:
            logger.info(f"Video duration: {clip.duration}")
            if current_time >= clip.duration or current_time <= 0:
                logger.error("Invalid split time.")
                return JsonResponse({"error": "Invalid split time"}, status=400)

            part1 = clip.subclip(0, current_time)
            part2 = clip.subclip(current_time, clip.duration)

            part1_path = f"{settings.MEDIA_ROOT}/part1_{video_id}.mp4"
            part1_name = f"part1_{video_id}.mp4"
            part2_path = f"{settings.MEDIA_ROOT}/part2_{video_id}.mp4"
            part2_name = f"part2_{video_id}.mp4"
            part1_url = f"{settings.MEDIA_URL}part1_{video_id}.mp4"
            part2_url = f"{settings.MEDIA_URL}part2_{video_id}.mp4"

            part1.write_videofile(part1_path, codec="libx264")
            part2.write_videofile(part2_path, codec="libx264")

        return JsonResponse({
            "oldVideoId": video_id,
            "part1": {
                "id": f"part1_{video_id}",
                "name" : part1_name,
                "duration": current_time,
                "startTime": 0,
                "endTime": current_time,
                "url": f"http://localhost:8000{part1_url}",
                "position": video_position,
            },
            "part2": {
                "id": f"part2_{video_id}",
                "name" : part2_name,
                "duration": clip.duration - current_time,
                "startTime": current_time,
                "endTime": clip.duration,
                "url": f"http://localhost:8000{part2_url}",
            }
        })

    except Exception as e:
        logger.error(f"Error during video splitting: {e}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)

import requests

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def split_audio(request):
    try:
        logger.info("Splitting audio started.")
        audio_id = request.POST.get("audioId")
        audio_position = request.POST.get("audioPosition")
        audio_image = request.POST.get("audioImage")
        current_time = float(request.POST.get("currentTime"))

        print(f"current_time: {current_time}")

        if not audio_id or current_time is None:
            logger.error("Missing audioId or currentTime.")
            return JsonResponse({"error": "Missing audioId or currentTime"}, status=400)

        try:
            audio = Audio.objects.get(id=audio_id)
        except Audio.DoesNotExist:
            logger.error(f"Audio with ID {audio_id} not found.")
            return JsonResponse({"error": "Audio not found"}, status=404)

        audio_url = audio.audio_file
        logger.info(f"Audio file: {audio_url}")


        local_audio_path = os.path.join(settings.MEDIA_ROOT, f"{audio_id}.mp3")
        response = requests.get(audio_url, stream=True)

        if response.status_code == 200:
            with open(local_audio_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            logger.info(f"Downloaded audio to {local_audio_path}")
        else:
            logger.error(f"Failed to download audio file from {audio_url}")
            return JsonResponse({"error": "Failed to download audio file"}, status=400)


        audio_clip = AudioSegment.from_file(local_audio_path)
        logger.info(f"Audio duration: {len(audio_clip) / 1000} seconds")

        if current_time * 1000 >= len(audio_clip) or current_time <= 0:
            logger.error("Invalid split time.")
            return JsonResponse({"error": "Invalid split time"}, status=400)

        part1 = audio_clip[:int(current_time * 1000)]
        part2 = audio_clip[int(current_time * 1000):]

        part1_path = os.path.join(settings.MEDIA_ROOT, f"part1_{audio_id}.mp3")
        part1_name = f"part1_{audio_id}.mp3"
        part2_path = os.path.join(settings.MEDIA_ROOT, f"part2_{audio_id}.mp3")
        part2_name = f"part2_{audio_id}.mp3"
        part1_url = os.path.join(settings.MEDIA_URL, f"part1_{audio_id}.mp3")
        part2_url = os.path.join(settings.MEDIA_URL, f"part2_{audio_id}.mp3")

        part1.export(part1_path, format="mp3")
        part2.export(part2_path, format="mp3")


        if os.path.exists(local_audio_path):
            os.remove(local_audio_path)

        return JsonResponse({
            "oldAudioId": audio_id,
            "part1": {
                "id": f"part1_{audio_id}",
                "name": part1_name,
                "duration": current_time,
                "startTime": 0,
                "endTime": current_time,
                "url": f"http://localhost:8000{part1_url}",
                "position": audio_position,
                "image": audio_image,
            },
            "part2": {
                "id": f"part2_{audio_id}",
                "name": part2_name,
                "duration": (len(audio_clip) / 1000) - current_time,
                "startTime": current_time,
                "endTime": len(audio_clip) / 1000,
                "url": f"http://localhost:8000{part2_url}",
                "image": audio_image,
            }
        })

    except Exception as e:
        logger.error(f"Error during audio splitting: {e}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def merge_video(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))
        video_width, video_height = 1272, 720

        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)

        videos_data = request.POST.getlist('videos')
        videos = [json.loads(video_data) for video_data in videos_data]

        print(f"Duration videos: {total_duration}")
        print(f"Received videos: {videos}")

        video_clips = []
        for video in videos:
            url = video.get('url')
            startTime = float(video.get('startTime', 0.0))
            endTime = float(video.get('endTime', total_duration))
            duration = float(video.get('duration', 5.0))
            scale = float(video.get('scale', 1.0))
            positionX = float(video.get('positionX', 0))
            positionY = float(video.get('positionY', 0))
            rotate_angle = float(video.get('rotate', 0))
            opacity = float(video.get('opacity', 100)) / 100.0
            voice = float(video.get('voice', 1.0))
            speed = float(video.get('speed', 1.0))
            print(f"Rotate angle: {rotate_angle}")
            is_video_file = is_video(url)

            if is_video_file is True:
                response = requests.get(url)
                video_file = BytesIO(response.content)

                with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                    temp_video.write(video_file.getvalue())
                    video_path = temp_video.name

                video_clip = VideoFileClip(video_path).subclip(0, duration)
                video_clip = video_clip.set_start(startTime)

                scale_video = scale / 100

                if scale_video != 1.0:

                    video_clip = resize(video_clip, scale_video)

                video_clip = rotate(video_clip, -rotate_angle, expand=True)

                new_width, new_height = video_clip.size
                print(f"New video size after rotation: {new_width}, {new_height}")

                new_width, new_height = video_clip.size
                print(f"Video size after resize: {new_width}, {new_height}")

                centerX = (video_width - new_width) / 2 + positionX

                centerY = (video_height - new_height) / 2 + positionY

                video_clip = video_clip.set_position((centerX, centerY))

                if opacity < 1.0:
                    video_clip = video_clip.set_opacity(opacity)
                #

                if speed != 1.0:
                    video_clip = video_clip.fx(vfx.speedx, speed)

                voice_dB = min(max(voice, -60), 6)
                linear_multiplier = 10 ** (voice_dB / 20)

                if video_clip.audio:
                    video_clip = video_clip.volumex(linear_multiplier)

                video_clips.append(video_clip)

            elif is_video_file is False:

                response = requests.get(url)
                if response.status_code == 200:
                    image_data = BytesIO(response.content)

                    pil_image = Image.open(image_data).convert("RGBA")
                    np_image = np.array(pil_image)

                    image_clip = ImageClip(np_image).set_duration(duration).subclip(0, duration)
                    image_clip = image_clip.set_start(startTime)

                    scale_image = scale / 100

                    if scale_image != 1.0:
                        image_clip = resize(image_clip, scale_image)


                    image_clip = rotate(image_clip, -rotate_angle, expand=True)

                    new_width, new_height = image_clip.size

                    new_width, new_height = image_clip.size

                    centerX = (video_width - new_width) / 2 + positionX

                    centerY = (video_height - new_height) / 2 + positionY

                    image_clip = image_clip.set_position((centerX, centerY))

                    if opacity < 1.0:
                        image_clip = image_clip.set_opacity(opacity)
                    #

                    if speed != 1.0:
                        image_clip = image_clip.fx(vfx.speedx, speed)

                    video_clips.append(image_clip)

        print(f"video_clips: {len(video_clips)}")

        if not len(video_clips) > 0:
            print("No video clips available, using black_clip as final_clip.")
            final_clip = black_clip
        else:
            final_clip = CompositeVideoClip([black_clip] + video_clips)

        filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'],
                                   fps=24)
        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})
    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_audio(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))
        video_width, video_height = 1272, 720

        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)

        edited_video_url = request.POST.get('linkVideo', None)
        print(edited_video_url)

        audios_data = request.POST.getlist('audios')
        audios = [json.loads(audio_data) for audio_data in audios_data]

        print(f"Duration videos: {total_duration}")
        print(f"Received audios: {audios}")

        video_clips = []
        if edited_video_url:
            response = requests.get(edited_video_url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path)
            video_clip = video_clip.set_start(0)


            scale_factor = max(video_width / video_clip.w, video_height / video_clip.h)
            video_clip = video_clip.resize(scale_factor)


            centerX = (video_width - video_clip.size[0]) / 2
            centerY = (video_height - video_clip.size[1]) / 2
            video_clip = video_clip.set_position((centerX, centerY))

            video_clips.append(video_clip)
        final_clip = CompositeVideoClip([black_clip] + video_clips)

        original_audio = final_clip.audio
        if original_audio is not None:
            audio_clips = [original_audio]
        else:
            audio_clips = []

        for audio in audios:
            url = audio.get('url')
            startTime = float(audio.get('startTime', 0.0))
            endTime = float(audio.get('endTime', total_duration))
            duration = float(audio.get('duration', 5.0))
            voice = float(audio.get('voice', 1.0))
            speed = float(audio.get('speed', 1.0))

            response = requests.get(url)
            audio_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
                temp_audio.write(audio_file.getvalue())
                audio_path = temp_audio.name

            audio_clip = AudioFileClip(audio_path)

            audio_clip = audio_clip.subclip(0, min(duration, audio_clip.duration))
            audio_clip = audio_clip.set_start(startTime)

            if speed != 1.0:
                audio_clip = audio_clip.fx(vfx.speedx, speed)

            voice_dB = min(max(voice, -60), 6)
            linear_multiplier = 10 ** (voice_dB / 20)

            audio_clip = audio_clip.volumex(linear_multiplier)

            audio_clips.append(audio_clip)

        if len(audio_clips) > 0:
            final_audio = CompositeAudioClip(audio_clips)
            final_clip = final_clip.set_audio(final_audio)
        else:
            print("No audio clips to process.")


        filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'],
                                   fps=24)

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})
    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

def resize_gif(gif_path, scale):
    gif = VideoFileClip(gif_path)
    frames = []
    for frame in gif.iter_frames(fps=gif.fps, dtype="uint8"):
        image = Image.fromarray(frame)
        image = image.resize((int(image.width * scale), int(image.height * scale)))
        frames.append(np.array(image))
    new_gif = ImageSequenceClip(frames, fps=gif.fps)
    return new_gif

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_sticker(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))
        video_width, video_height = 1272, 720

        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)

        edited_video_url = request.POST.get('linkVideo', None)
        print(edited_video_url)

        stickers_data = request.POST.getlist('stickers')
        stickers = [json.loads(sticker_data) for sticker_data in stickers_data]

        print(f"Duration videos: {total_duration}")
        print(f"Received stickers: {stickers}")

        try:
            stickers = json.loads(stickers) if isinstance(stickers, str) else stickers
        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'Error decoding JSON: {str(e)}'}, status=400)

        video_clips = []
        if edited_video_url:
            response = requests.get(edited_video_url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path)
            video_clip = video_clip.set_start(0)


            scale_factor = max(video_width / video_clip.w, video_height / video_clip.h)
            video_clip = video_clip.resize(scale_factor)


            centerX = (video_width - video_clip.size[0]) / 2
            centerY = (video_height - video_clip.size[1]) / 2
            video_clip = video_clip.set_position((centerX, centerY))

            video_clips.append(video_clip)
        final_clip = CompositeVideoClip([black_clip] + video_clips)

        for sticker in stickers:
            url = sticker.get('url')
            print(url)
            startTime = float(sticker.get('startTime', 0.0))
            endTime = float(sticker.get('endTime', total_duration))
            duration = float(sticker.get('duration', 5.0))
            scale = int(sticker.get('scale', 100))/100
            scaleWidth = int(sticker.get('scaleWidth', 100))/100
            scaleHeight = int(sticker.get('scale', 100))/100
            positionX = float(sticker.get('positionX', 0.0)) * 3
            positionY = float(sticker.get('positionY', 0.0)) * 3
            rotate_angle = float(sticker.get('rotate', 0.0))

            response = requests.get(url)
            print(f"GIF response status: {response.status_code}")
            sticker_bytes = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_gif:
                temp_gif.write(sticker_bytes.getbuffer())
                temp_gif_path = temp_gif.name

            sticker_clip = VideoFileClip(temp_gif_path, has_mask=True)
            print(f"GIF Info: {sticker_clip.size}")


            if scale != 1.0:
                sticker_clip = sticker_clip.resize(scale)
            if rotate_angle != 0:
                sticker_clip = rotate(sticker_clip, -rotate_angle, expand=True)

            repeat_count = int(duration // sticker_clip.duration) + 1
            sticker_clips = []
            for i in range(repeat_count):
                sticker_clip = VideoFileClip(temp_gif_path, has_mask=True)
                loop_start_time = startTime + i * sticker_clip.duration
                loop_end_time = endTime + i * sticker_clip.duration
                if i == repeat_count:
                    sticker_copy = sticker_clip.copy().set_position((positionX, positionY)).set_start(
                        loop_start_time).set_duration(endTime - loop_start_time)
                else:
                    sticker_copy = sticker_clip.copy().set_position((positionX, positionY)).set_start(
                        loop_start_time).set_duration(sticker_clip.duration)
                    print(f'i: {i}')
                    print(f'loop_start_time: {loop_start_time}')
                    print(f'sticker_copy: {sticker_copy}')
                sticker_clips.append(sticker_copy)

            final_clip = CompositeVideoClip([final_clip] + sticker_clips)

            os.remove(temp_gif_path)

        filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'],
                                   fps=24)

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})
    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_text(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))
        video_width, video_height = 1272, 720

        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)

        edited_video_url = request.POST.get('linkVideo', None)
        print(f"edited video texts: {edited_video_url}")

        texts_data = request.POST.getlist('texts')
        texts = [json.loads(text_data) for text_data in texts_data]

        print(f"Duration videos: {total_duration}")
        print(f"Received texts: {texts}")

        try:
            texts = json.loads(texts) if isinstance(texts, str) else texts
        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'Error decoding JSON: {str(e)}'}, status=400)


        video_clips = []
        if edited_video_url:
            response = requests.get(edited_video_url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path)
            video_clip = video_clip.set_start(0)


            scale_factor = max(video_width / video_clip.w, video_height / video_clip.h)
            video_clip = video_clip.resize(scale_factor)


            centerX = (video_width - video_clip.size[0]) / 2
            centerY = (video_height - video_clip.size[1]) / 2
            video_clip = video_clip.set_position((centerX, centerY))

            video_clips.append(video_clip)
        final_clip = CompositeVideoClip([black_clip] + video_clips)

        for text in texts:
            content = text.get('content', "Default")
            style = text.get('style', {})
            color = style.get('color', '#FFFFFF')
            fontSize = int(style.get('fontSize', 20))
            position = float(text.get('position', 0.0))
            startTime = float(text.get('startTime', 0.0))
            endTime = float(text.get('endTime', total_duration))
            duration = float(text.get('duration', 5.0))
            text_clip = TextClip(
                content,
                fontsize=fontSize,
                color=color
            ).set_position(('center', 'center')).set_start(startTime).set_duration(duration)
            final_clip = CompositeVideoClip([final_clip, text_clip])

        filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'],
                                   fps=24)

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})
    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_filter(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))
        video_width, video_height = 1272, 720

        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)

        edited_video_url = request.POST.get('linkVideo', None)
        print(edited_video_url)

        filters_data = request.POST.getlist('filters')
        filters = [json.loads(filter_data) for filter_data in filters_data]

        print(f"Duration videos: {total_duration}")
        print(f"Received filters: {filters}")

        try:
            filters = json.loads(filters) if isinstance(filters, str) else filters
        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'Error decoding JSON: {str(e)}'}, status=400)


        video_clips = []
        if edited_video_url:
            response = requests.get(edited_video_url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path)
            video_clip = video_clip.set_start(0)


            scale_factor = max(video_width / video_clip.w, video_height / video_clip.h)
            video_clip = video_clip.resize(scale_factor)


            centerX = (video_width - video_clip.size[0]) / 2
            centerY = (video_height - video_clip.size[1]) / 2
            video_clip = video_clip.set_position((centerX, centerY))

            video_clips.append(video_clip)
        final_clip = CompositeVideoClip([black_clip] + video_clips)

        for filter in filters:
            config = filter.get('config', {})
            startTime = float(filter.get('startTime', 0.0))
            endTime = float(filter.get('endTime', total_duration))

            final_clip = apply_filter_in_time_range(final_clip, config, startTime, endTime)

        filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'],
                                   fps=24)

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})
    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_effect(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))
        video_width, video_height = 1272, 720

        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)

        edited_video_url = request.POST.get('linkVideo', None)
        print(edited_video_url)

        effects_data = request.POST.getlist('effects')
        effects = [json.loads(effect_data) for effect_data in effects_data]

        print(f"Duration videos: {total_duration}")
        print(f"Received effects: {effects}")

        video_clips = []
        if edited_video_url:
            response = requests.get(edited_video_url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path)
            video_clip = video_clip.set_start(0)


            scale_factor = max(video_width / video_clip.w, video_height / video_clip.h)
            video_clip = video_clip.resize(scale_factor)


            centerX = (video_width - video_clip.size[0]) / 2
            centerY = (video_height - video_clip.size[1]) / 2
            video_clip = video_clip.set_position((centerX, centerY))

            video_clips.append(video_clip)
        final_clip = CompositeVideoClip([black_clip] + video_clips)

        for effect in effects:
            config = effect.get('config', {})
            startTime = float(effect.get('startTime', 0.0))
            endTime = float(effect.get('endTime', total_duration))

            final_clip = apply_effect_in_time_range(final_clip, config, startTime, endTime)


        filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'],
                                   fps=24)

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})
    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_video(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))
        video_width, video_height = 1272, 720

        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)

        edited_video_url = request.POST.get('linkVideo', None)
        print(edited_video_url)

        audios_data = request.POST.getlist('audios')
        audios = [json.loads(audio_data) for audio_data in audios_data]

        texts_data = request.POST.getlist('texts')
        texts = [json.loads(text_data) for text_data in texts_data]

        print(f"Duration videos: {total_duration}")
        print(f"Received audios: {audios}")
        print(f"Received texts: {texts}")

        try:
            texts = json.loads(texts) if isinstance(texts, str) else texts
        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'Error decoding JSON: {str(e)}'}, status=400)

        video_clips = []
        if edited_video_url:
            response = requests.get(edited_video_url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path)
            video_clip = video_clip.set_start(0)


            scale_factor = max(video_width / video_clip.w, video_height / video_clip.h)
            video_clip = video_clip.resize(scale_factor)


            centerX = (video_width - video_clip.size[0]) / 2
            centerY = (video_height - video_clip.size[1]) / 2
            video_clip = video_clip.set_position((centerX, centerY))

            video_clips.append(video_clip)
        final_clip = CompositeVideoClip([black_clip] + video_clips)

        original_audio = final_clip.audio
        if original_audio is not None:
            audio_clips = [original_audio]
        else:
            audio_clips = []

        for audio in audios:
            url = audio.get('url')
            startTime = float(audio.get('startTime', 0.0))
            endTime = float(audio.get('endTime', total_duration))
            duration = float(audio.get('duration', 5.0))
            voice = float(audio.get('voice', 1.0))
            speed = float(audio.get('speed', 1.0))

            response = requests.get(url)
            audio_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
                temp_audio.write(audio_file.getvalue())
                audio_path = temp_audio.name

            audio_clip = AudioFileClip(audio_path)

            audio_clip = audio_clip.subclip(0, min(duration, audio_clip.duration))
            audio_clip = audio_clip.set_start(startTime)

            if speed != 1.0:
                audio_clip = audio_clip.fx(vfx.speedx, speed)

            voice_dB = min(max(voice, -60), 6)
            linear_multiplier = 10 ** (voice_dB / 20)

            audio_clip = audio_clip.volumex(linear_multiplier)

            audio_clips.append(audio_clip)

        if len(audio_clips) > 0:
            final_audio = CompositeAudioClip(audio_clips)
            final_clip = final_clip.set_audio(final_audio)
        else:
            print("No audio clips to process.")

        for text in texts:
            content = text.get('content', "Default")
            style = text.get('style', {})
            color = style.get('color', '#FFFFFF')
            stroke_color = style.get('strokeColor', '#FFFFFF')
            backgroundColor = style.get('backgroundColor', '#FFFFFF')
            strokeWidth = style.get('strokeWidth', 1)
            scale = int(text.get('scale', 100))
            fontSize = (int(text.get('fontSize', 20)) * 3) * (scale/100)
            position = float(text.get('position', 0.0)) * 3
            positionX = float(text.get('positionX', 0.0)) * 3
            positionY = float(text.get('positionY', 0.0)) * 3
            rotate_angle = float(text.get('rotate', 0.0))
            opacity = float(text.get('opacity', 100.0)) / 100.0
            voice = float(text.get('voice', 0.0))
            speed = float(text.get('speed', 0.0))
            startTime = float(text.get('startTime', 0.0))
            endTime = float(text.get('endTime', total_duration))
            duration = float(text.get('duration', 5.0))
            fontStyle = text.get('fontStyle', "Arial")
            pattern = text.get('pattern', "normal")
            case = text.get('case', "normal")
            blod = text.get('blod', False)
            underline = text.get('underline', False)
            italic = text.get('italic', False)
            if text.get('italic', False) and text.get('bold', False):
                fontStyle = "/usr/share/fonts/truetype/msttcorefonts/" + fontStyle +  "_Bold_Italic.ttf"
            elif text.get('italic', False):
                fontStyle = "/usr/share/fonts/truetype/msttcorefonts/" + fontStyle +  "_Italic.ttf"
            elif text.get('bold', False):
                fontStyle = "/usr/share/fonts/truetype/msttcorefonts/" + fontStyle +  "_Bold.ttf"
            else:
                fontStyle = "/usr/share/fonts/truetype/msttcorefonts/" + fontStyle +  ".ttf"

            print(f"bold: {text.get('bold', False)}")
            print(f"fontStyle: {fontStyle}")

            styleOfText = text.get('styleOfText', "lettercase").lower()
            if styleOfText == "uppercase":
                content = content.upper()
            elif styleOfText == "lowercase":
                content = content.lower()
            elif styleOfText == "lettercase":
                content = content.capitalize()


            print(f"fontSize: {fontSize}")
            text_clip = TextClip(
                content,
                fontsize=fontSize,
                color=color,
                font= fontStyle,
                stroke_color = stroke_color,
                stroke_width = strokeWidth,
            ).set_position((positionX, positionY)).set_start(startTime).set_duration(duration)

            if rotate_angle != 0:
                text_clip = text_clip.rotate(-rotate_angle, resample="bilinear")

            if opacity < 1.0:
                text_clip = text_clip.set_opacity(opacity)

            if speed != 1.0:
                text_clip = text_clip.fx(vfx.speedx, speed)

            clips = [text_clip]

            def hex_to_rgb(hex_color):
                hex_color = hex_color.lstrip('#')
                return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))

            rgb_color = hex_to_rgb(color)

            if underline:
                text_width, text_height = text_clip.size
                underline_clip = ColorClip(
                    size=(text_width, 5),
                    color=rgb_color
                ).set_position((positionX, positionY + text_height + 5))
                underline_clip = underline_clip.set_start(startTime).set_duration(duration)
                clips.append(underline_clip)

            final_clip = CompositeVideoClip([final_clip] + clips)

        filename = 'download_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'],
                                   fps=24)

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})
    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)
def serve_video(request, filename):
    try:
        print(f"Serving video file: {filename}")
        file_path = os.path.join(settings.MEDIA_ROOT, filename)

        file = open(file_path, 'rb')

        response = FileResponse(file, content_type='video/mp4')
        response['Content-Disposition'] = f'inline; filename={filename}'
        response['Accept-Ranges'] = 'bytes'

        return response

    except FileNotFoundError:
        print(f"File not found: {filename}")
        return JsonResponse({'error': 'File not found'}, status=404)

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

@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_init(request):
    page = request.GET.get('page', 'login')  
    print("Page parameter:", page)
    url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={settings.GOOGLE_REDIRECT_URI}&"
        f"scope=openid email profile&"
        f"response_type=code&"
        f"state={page}"
    )
    return JsonResponse({"url": url})


@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_callback(request):
    code = request.GET.get("code")
    page = request.GET.get('state', 'login')
    print("state", page)

    if not code:
        return JsonResponse({"error": "No code provided"}, status=400)

    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_response = requests.post(token_url, data=token_data)
    token_response_data = token_response.json()

    if "access_token" not in token_response_data:
        return JsonResponse({"error": "Authentication failed"}, status=400)

    
    user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    headers = {"Authorization": f"Bearer {token_response_data['access_token']}"}
    user_info_response = requests.get(user_info_url, headers=headers)
    user_info = user_info_response.json()

    email = user_info.get("email")
    if not email:
        return JsonResponse({"error": "No email found"}, status=400)

    name = user_info.get("name", "")
    username = email.split('@')[0]

    
    user = User.objects.filter(email=email).first()

    if page == "register":
        
        if not user:
            
            user = User.objects.create(
                email=email,
                fullname=name,
                username=username,
                is_verified=False,
            )
            user.set_unusable_password()
            user.save()

            
            uidb64 = urlsafe_base64_encode(force_bytes(user.id))
            reset_token = generate_reset_password_token(user)
            reset_url = f"http://localhost:3000/set-password/{uidb64}/{reset_token}"
            try:
                send_mail(
                    'Set up your password',
                    f'Thank you for signing up. Please set up your password by clicking the link: {reset_url}',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print("Failed to send email:", e)
                user.delete()
                return JsonResponse({"error": "Failed to send verification email"}, status=500)

            
            return redirect("http://localhost:3000/login")
        else:
            
            return redirect("http://localhost:3000/login")

    elif page == "login":
        
        if not user:
            return JsonResponse({"error": "User not found, please register first"}, status=400)

        if not user.is_verified:
            verified_url = f"http://localhost:3000/verified"
            return redirect(verified_url)

        refresh = RefreshToken.for_user(user)
        response_data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        serializer = UserSerializer(instance=user)

        role = serializer.data['role']
        is_valid = serializer.data['is_valid']

        if is_valid:
            if role == 'admin':
                redirect_url = '/admin'
            else:
                redirect_url = '/user'

            response_data.update({
                "user": serializer.data,
                "redirect_url": redirect_url
            })

            encoded_user = urllib.parse.quote(json.dumps(serializer.data))
            frontend_redirect_url = f"http://localhost:3000/login?access={response_data['access']}&refresh={response_data['refresh']}&user={encoded_user}"

            return redirect(frontend_redirect_url)
        else:
            return redirect("http://localhost:3000/login")

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
        is_valid = serializer.data['is_valid']
        if is_valid:
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
            return Response({'error': 'Account not available'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

def generate_reset_password_token(user):
    token = AccessToken.for_user(user)
    token['reset_password'] = True
    token.set_exp(lifetime=timedelta(hours=1))
    return str(token)

def validate_reset_password_token(token):
    try:
        decoded_token = AccessToken(token)
        if decoded_token.get('reset_password') != True:
            raise ValueError("Invalid token for password reset")
        return decoded_token['user_id']
    except Exception as e:
        raise ValueError(f"Invalid Token: {e}")

@api_view(['POST'])
@permission_classes([AllowAny])
def set_password(request, uidb64, token):
    print("this is reset password function")
    password = request.data.get('password')
    if not password:
        return Response({"error": "Password is required."}, status=400)

    try:
        user_id = force_str(urlsafe_base64_decode(uidb64))
        print("user_id", user_id)
        user = User.objects.get(pk=user_id)

        try:
            user_id_from_token = validate_reset_password_token(token)
            if user_id_from_token != user.id:
                raise ValueError("Token does not match user")
        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        user.set_password(password)
        user.is_verified = True
        user.save()
        return Response({"message": "Password has been reset successfully."}, status=200)

    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
        return Response({"error": str(e)}, status=400)

def send_verification_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    set_password_url = f"{settings.FRONTEND_URL}/set-password/{uid}/{token}/"

    subject = "Set Your Password for Your New Account"
    message = f"Thank you for signing up. Please set your password by clicking the link: {set_password_url}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():

            user = serializer.save()
            user.is_delete = True
            user.save()
            send_verification_email(user)
            logger.info(f"Created user: {user}")

            try:
                tokens = get_tokens_for_user(user)
            except Exception as token_error:
                logger.error(f"Token generation failed: {token_error}")
                return JsonResponse({'error': 'Token generation failed'}, status=500)

            return JsonResponse({'tokens': tokens, 'user': serializer.data}, status=201)
        else:
            print("Validation errors:", serializer.errors)
            return JsonResponse({'error': serializer.errors}, status=400)
    except Exception as e:
        logger.error(f"Unexpected error during registration: {e}")
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.is_verified = True
    user.save()
    return JsonResponse({"message": "Email verified successfully. You can now log in."})


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user(request, userId):
    try:
        user = User.objects.get(id=userId, is_delete=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    else:
        print("Received data:", request.data)
        print("Serializer errors:", serializer.errors)
        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = User.objects.filter(is_delete=False, role="user")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_new_user(request):
    user = User.objects.filter(is_delete=False, is_new=True, role="user")
    user.update(is_new=False)

    users = User.objects.filter(is_delete=False, role="user")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=200)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def lock_user(request):
    userId = request.data.get('userId')
    try:
        user = User.objects.get(id=userId, is_valid=True)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    user.is_valid = False
    user.save()

    users = User.objects.filter(is_delete=False, role="user")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unlock_user(request):
    userId = request.data.get('userId')
    try:
        user = User.objects.get(id=userId, is_valid=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    user.is_valid = True
    user.save()

    users = User.objects.filter(is_delete=False, role="user")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request, userId):
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')

    if not current_password or not new_password:
        return JsonResponse({'message': 'Thiếu dữ liệu cần thiết'}, status=400)

    try:
        user = User.objects.get(id=userId, is_delete=False)
    except User.DoesNotExist:
        return JsonResponse({'message': 'User not found'}, status=404)

    if not user.check_password(current_password):
        return JsonResponse({'message': 'Mật khẩu hiện tại không chính xác'}, status=400)

    user.set_password(new_password)
    user.save()

    user_serializer = UserSerializer(user)

    return Response(user_serializer.data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_projects(request):
    user = request.user
    projects = Project.objects.filter(user=user, is_delete=False)
    serializer = ProjectSerializer(projects, many=True)
    return Response({'projects': serializer.data}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_deleted_projects(request):
    user = request.user
    projects = Project.objects.filter(user=user, is_delete=True)
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
def delete_project(request):
    projectId = request.data.get('projectId')
    try:
        project = Project.objects.get(id=projectId, is_delete=False)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)

    project.is_delete = True
    project.save()

    return JsonResponse({'message': 'Project deleted successfully'}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restore_project(request):
    projectId = request.data.get('projectId')
    try:
        project = Project.objects.get(id=projectId, is_delete=True)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)

    project.is_delete = False
    project.save()

    return JsonResponse({'message': 'Project restore successfully'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restore_all_project(request):
    projects = Project.objects.filter(is_delete=True)

    if not projects.exists():
        return JsonResponse({'error': 'No deleted projects found'}, status=404)

    projects.update(is_delete=False)

    return JsonResponse({'message': 'All deleted projects have been restored successfully'}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_all_project(request):
    projects = Project.objects.filter(is_delete=True)
    if not projects.exists:
        return JsonResponse({'error': 'Project not found'}, status=404)

    projects.delete()

    return JsonResponse({'message': 'Project restore successfully'}, status=200)


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
