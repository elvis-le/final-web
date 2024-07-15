from django.shortcuts import render
from django.http import HttpResponse
from myapp.utils.video_processing import cut_video, merge_videos, add_effect, convert_format
# Create your views here.
def home(request):
    return render(request, 'home.html')
