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
from moviepy.video.fx.crop import crop
from moviepy.video.fx.resize import resize
from moviepy.video.fx.rotate import rotate
from moviepy.audio.fx.volumex import volumex
from moviepy.video.fx import all as vfx
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

def apply_filter_in_time_range(clip, config, start_time, end_time):

    sub_clip = clip.subclip(start_time, end_time)
    return sub_clip

def apply_effect_in_time_range(clip, config, startTime, endTime):
    effect_name = config.get('name', 'default')
    print(f"Effect {effect_name} applied from {startTime} to {endTime}")  # Logging để kiểm tra

    # Tạo một subclip trong khoảng thời gian startTime đến endTime
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

    # Thay vì cắt và nối lại các đoạn, ta có thể áp dụng hiệu ứng trực tiếp lên đoạn thời gian đã cắt bằng CompositeVideoClip
    final_clip = CompositeVideoClip([clip, subclip.set_start(startTime)])

    return final_clip

def apply_blur_effect(clip, config, startTime, endTime):
    blur_value = 61
    print(f"Applying blur with value: {blur_value} from {startTime} to {endTime}")

    # Đảm bảo blur_value là số lẻ và lớn hơn 0
    if blur_value % 2 == 0:
        blur_value += 1
    if blur_value <= 0:
        blur_value = 1

    def blur_frame(frame):
        # Chuyển đổi kiểu dữ liệu của khung hình từ float64 sang uint8 nếu cần
        if frame.dtype != 'uint8':
            frame = (frame * 255).astype('uint8')  # Chuyển đổi từ float64 (0-1) sang uint8 (0-255)

        # Chuyển đổi từ RGB sang BGR (OpenCV sử dụng BGR)
        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        # Áp dụng GaussianBlur nhiều lần để tăng cường hiệu ứng mờ
        for _ in range(3):  # Áp dụng hiệu ứng blur 3 lần để tăng độ mờ
            frame_bgr = cv2.GaussianBlur(frame_bgr, (blur_value, blur_value), 0)

        # Chuyển đổi ngược lại từ BGR sang RGB
        blurred_frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)

        return blurred_frame_rgb

    # Áp dụng hiệu ứng blur lên toàn bộ đoạn clip từ startTime đến endTime
    blur_clip = clip.fl_image(blur_frame)

    return blur_clip.subclip(startTime, endTime)

def apply_glitch_effect(clip, config):
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

    # Hàm để cắt video dần dần theo thời gian dựa trên clipPath
    def apply_clip_path_dynamic(frame, progress):
        height, width = frame.shape[:2]
        mask = np.ones_like(frame) * 255  # Mặt nạ mặc định trắng toàn bộ

        if clipPath:
            # Thay đổi cách tính top_inset và bottom_inset để đóng từ ngoài vào
            top_inset = 0.6 * progress  # Tiến độ càng lớn, phần ngoài càng bị cắt
            bottom_inset = 0.6 * progress  # Tiến độ càng lớn, phần dưới càng bị cắt

            # Áp dụng cắt phần trên và dưới của video dần dần
            mask[:int(height * top_inset), :] = 0  # Cắt phần trên dần dần từ ngoài vào
            mask[int(height * (1 - bottom_inset)):, :] = 0  # Cắt phần dưới dần dần từ ngoài vào

        # Áp dụng mặt nạ (mask)
        return cv2.bitwise_and(frame, mask)

    # Hàm áp dụng Gaussian blur và clipPath động theo thời gian
    def tilt_shift_frame(get_frame, t):
        frame = get_frame(t)
        # Đảm bảo frame là Numpy array
        if not isinstance(frame, np.ndarray):
            frame = np.array(frame)  # Chuyển đổi frame thành Numpy array nếu cần

        # Tính toán tiến độ (progress) theo thời gian
        progress = (t - startTime) / (endTime - startTime)
        progress = max(0, min(1, progress))  # Giới hạn progress trong khoảng [0, 1]

        # Áp dụng Gaussian blur
        blurred_frame = cv2.GaussianBlur(frame, (blur_value, blur_value), 0)

        # Áp dụng cắt động (clipPath) theo progress
        if clipPath:
            blurred_frame = apply_clip_path_dynamic(blurred_frame, progress)

        return blurred_frame

    # Sử dụng `fl` thay vì `fl_image` để truyền thêm thời gian `t`
    tilt_shift_clip = clip.fl(tilt_shift_frame)

    return tilt_shift_clip.subclip(startTime, endTime)
def apply_invert_colors_effect(clip, config, startTime, endTime):
    def invert_frame(frame):
        return 255 - frame  # Đảo ngược màu sắc

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
    # Lấy giá trị từ config
    blur_value = 61
    opacity = 0.3
    darkness = config.get('darkness', 0.5)
    yoyo = config.get('yoyo', False)
    repeat = config.get('repeat', 0)

    # Đảm bảo blur_value là số lẻ và lớn hơn 0
    if blur_value % 2 == 0:
        blur_value += 1
    if blur_value <= 0:
        blur_value = 1

    def ghost_effect_frame(frame):
        print(f"Frame dtype: {frame.dtype}, shape: {frame.shape}")

        # Chuyển đổi kiểu dữ liệu của khung hình từ float64 sang uint8 nếu cần
        if frame.dtype != 'uint8':
            frame = (frame * 255).astype('uint8')  # Chuyển đổi từ float64 (0-1) sang uint8 (0-255)

        # Áp dụng Gaussian Blur
        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        blurred_frame_bgr = cv2.GaussianBlur(frame_bgr, (blur_value, blur_value), 0)
        blurred_frame_rgb = cv2.cvtColor(blurred_frame_bgr, cv2.COLOR_BGR2RGB)

        # Áp dụng opacity bằng cách giảm trọng số của khung hình gốc để nó tối hơn
        blended_frame = cv2.addWeighted(blurred_frame_rgb, 1 - opacity, frame, opacity, 0)

        darkened_frame = (blended_frame * darkness).clip(0, 255).astype('uint8')
        return darkened_frame

    # Áp dụng hiệu ứng ghost cho clip
    ghost_clip = clip.fl_image(ghost_effect_frame)

    # Nếu yoyo được kích hoạt, lặp lại và đảo ngược hiệu ứng
    if yoyo:
        reversed_clip = ghost_clip.fx(vfx.time_mirror)
        ghost_clip = concatenate_videoclips([ghost_clip, reversed_clip])

    # Áp dụng subclip để giới hạn thời gian hiệu ứng
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_video(request):
    try:
        total_duration = float(request.POST.get('total_duration', 0.0))  
        video_width, video_height = 1272, 720

        
        black_clip = ColorClip(size=(video_width, video_height), color=(0, 0, 0), duration=total_duration).set_fps(24)


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


        print(f"Duration videos: {total_duration}")
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

            response = requests.get(url)
            video_file = BytesIO(response.content)

            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
                temp_video.write(video_file.getvalue())
                video_path = temp_video.name

            video_clip = VideoFileClip(video_path).subclip(0, duration)
            video_clip = video_clip.set_start(startTime)

            scale_video = scale/100
            #
            if scale_video != 1.0:
                video_clip = crop(video_clip, width=video_clip.w / scale_video, height=video_clip.h / scale_video,
                                  x_center=video_clip.w / scale_video, y_center=video_clip.h / scale_video)
                video_clip = resize(video_clip, scale_video)
            #
            # Xoay video với expand=True để giữ nguyên toàn bộ nội dung
            video_clip = rotate(video_clip, -rotate_angle, expand=True)

            # Lấy kích thước mới của video sau khi xoay
            new_width, new_height = video_clip.size
            print(f"New video size after rotation: {new_width}, {new_height}")

            # Kích thước màn hình đã cho (1272x720)
            screen_width = 1272
            screen_height = 720

            # Tính toán tỉ lệ resize để đảm bảo video có cùng chiều rộng hoặc chiều cao với màn hình
            scale_factor = max(screen_width / new_width, screen_height / new_height)

            # Resize video để đảm bảo video vừa khít màn hình theo chiều rộng hoặc chiều cao
            video_clip = video_clip.resize(scale_factor)

            # Lấy lại kích thước sau khi resize
            new_width, new_height = video_clip.size
            print(f"Video size after resize: {new_width}, {new_height}")

            # Tính toán vị trí để video nằm giữa màn hình
            centerX = (screen_width - new_width) / 2
            centerY = (screen_height - new_height) / 2

            # Đặt video vào giữa màn hình, các phần góc tràn ra ngoài
            video_clip = video_clip.set_position((centerX + positionX, centerY + positionY))

            if opacity < 1.0:
                video_clip = video_clip.set_opacity(opacity)
            #
            # # Adjust playback speed
            if speed != 1.0:
                video_clip = video_clip.fx(vfx.speedx, speed)

            voice_dB = min(max(voice, -60), 6)
            linear_multiplier = 10 ** (voice_dB / 20)

            # Set volume for audio
            if video_clip.audio:

                video_clip = video_clip.volumex(linear_multiplier)

            video_clips.append(video_clip)

        print(f"video_clips: {len(video_clips)}")

        if not len(video_clips) > 0:
            print("No video clips available, using black_clip as final_clip.")
            final_clip = black_clip  # Dùng black_clip nếu không có video
        else:
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

        if len(audio_clips) > 0:  # Chỉ ghép nếu có audio clips
            final_audio = CompositeAudioClip(audio_clips)
            final_clip = final_clip.set_audio(final_audio)
        else:
            print("No audio clips to process.")

        for filter_data in filters:
            config = filter_data.get('config', {})
            startTime = float(filter_data.get('startTime', 0.0))
            endTime = float(filter_data.get('endTime', total_duration))
            duration = endTime - startTime


            contrast = config.get('contrast', {}).get('default', 1)
            brightness = config.get('brightness', {}).get('default', 1)
            saturation = config.get('saturation', {}).get('default', 1)

            color_tone = config.get('color_tone', {})
            hue_shift = color_tone.get('hue_shift', {}).get('default', 0)
            shadow_tint = color_tone.get('shadow_tint', {}).get('default', [0, 0, 0])
            highlight_tint = color_tone.get('highlight_tint', {}).get('default', [255, 255, 255])

            subclip = final_clip.subclip(startTime, endTime)
            subclip = apply_filter_in_time_range(subclip, config, startTime, endTime)

            # Thay thế subclip đã được áp dụng hiệu ứng vào vị trí trong video chính
            final_clip = concatenate_videoclips(
                [final_clip.subclip(0, startTime), subclip, final_clip.subclip(endTime)])

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

        for effect in effects:
            config = effect.get('config', {})
            startTime = float(effect.get('startTime', 0.0))
            endTime = float(effect.get('endTime', total_duration))

            final_clip = apply_effect_in_time_range(final_clip, config, startTime, endTime)

        for sticker in stickers:
            url = sticker.get('url')
            print(url)
            startTime = float(sticker.get('startTime', 0.0))
            endTime = float(sticker.get('endTime', total_duration))
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

        filename = 'output_video.mp4'
        output_file_path = os.path.join(settings.MEDIA_ROOT, filename)
        final_clip.write_videofile(output_file_path, codec='libx264', audio_codec='aac',
                                   temp_audiofile="temp-audio.m4a", remove_temp=True,
                                   write_logfile=False, preset='medium', ffmpeg_params=['-movflags', 'faststart'], fps=24)

        return JsonResponse({'merged_video_url': f'{settings.MEDIA_URL}{filename}'})


    except Exception as e:

        print(f"Error processing request: {str(e)}")

        import traceback

        traceback.print_exc()  # In ra toàn bộ lỗi

        return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)


def serve_video(request, filename):
    try:
        print(f"Serving video file: {filename}")  # Thêm dòng này để kiểm tra
        file_path = os.path.join(settings.MEDIA_ROOT, filename)

        file = open(file_path, 'rb')

        response = FileResponse(file, content_type='video/mp4')
        response['Content-Disposition'] = f'inline; filename={filename}'
        response['Accept-Ranges'] = 'bytes'

        return response

    except FileNotFoundError:
        print(f"File not found: {filename}")  # Thêm dòng này nếu file không tìm thấy
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
        print("Received data:", request.data)  # Log dữ liệu nhận được
        print("Serializer errors:", serializer.errors)  # Log lỗi của serializer
        return JsonResponse({'error': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = User.objects.filter(is_delete=False, role="user")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    userId = request.data.get('userId')
    try:
        user = User.objects.get(id=userId, is_delete=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    user.is_delete = True
    user.save()

    return JsonResponse({'message': 'User deleted successfully'}, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request, userId):
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')

    # Kiểm tra nếu thiếu dữ liệu
    if not current_password or not new_password:
        return JsonResponse({'message': 'Thiếu dữ liệu cần thiết'}, status=400)

    try:
        user = User.objects.get(id=userId, is_delete=False)
    except User.DoesNotExist:
        return JsonResponse({'message': 'User not found'}, status=404)

    # So sánh mật khẩu hiện tại với mật khẩu đã mã hóa
    if not user.check_password(current_password):
        return JsonResponse({'message': 'Mật khẩu hiện tại không chính xác'}, status=400)

    # Mã hóa và lưu mật khẩu mới
    user.set_password(new_password)
    user.save()

    # Serialize and return the updated user data
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

    return JsonResponse({'message': 'Project restore successfully'}, status=201)


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
