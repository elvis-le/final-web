from moviepy.editor import VideoFileClip, concatenate_videoclips
import os

def cut_video(input_file, output_file, start_time, end_time):
    clip = VideoFileClip(input_file).subclip(start_time, end_time)
    clip.write_videofile(output_file)
    clip.close()

def merge_videos(input_files, output_file):
    clips = [VideoFileClip(file) for file in input_files]
    final_clip = concatenate_videoclips(clips)
    final_clip.write_videofile(output_file)
    final_clip.close()

def add_effect(input_file, output_file, effect_function):
    clip = VideoFileClip(input_file)
    modified_clip = effect_function(clip)
    modified_clip.write_videofile(output_file)
    clip.close()

def convert_format(input_file, output_file, format='mp4'):
    clip = VideoFileClip(input_file)
    clip.write_videofile(output_file, codec='libx264', audio_codec='aac')
    clip.close()
