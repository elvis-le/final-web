from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    role = models.CharField(max_length=50, default='user')
    birth_date = models.DateField(null=True, blank=True)
    sex = models.CharField(max_length=10, null=True, choices=(('Male', 'Male'), ('Female', 'Female')))
    address = models.CharField(max_length=255, null=True, blank=True)
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username



class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Video(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    video_url = models.URLField(max_length=500, null=False)
    name = models.CharField(max_length=255)
    duration = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=(('Unedited', 'Unedited'), ('Edited', 'Edited')), default='Unedited')
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Audio(models.Model):
    audio_file = models.URLField(max_length=500)
    image = models.URLField(max_length=500, default='https://btfptkpngrtnnqweftvx.supabase.co/storage/v1/object/public/audio_files/image/oweiIPFVGAAIVCmcAIV4eAaK5FeGcLQe5AqzJ1.jpeg')
    name = models.CharField(max_length=255, default='Default Audio')
    artist = models.CharField(max_length=255, blank=True)
    duration = models.FloatField(null=True, blank=True)
    category = models.CharField(max_length=50, choices=(('vlog', 'Vlog'), ('tourism', 'Tourism'), ('love', 'Love'), ('spring', 'Spring'), ('beat', 'Beat'), ('heal', 'Heal'), ('warm', 'Warm'), ('trend', 'Trend'), ('revenue', 'Revenue'), ('horrified', 'Horrified'), ('laugh', 'Laugh')))
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Text(models.Model):
    image = models.URLField(max_length=500, default='https://btfptkpngrtnnqweftvx.supabase.co/storage/v1/object/public/audio_files/image/oweiIPFVGAAIVCmcAIV4eAaK5FeGcLQe5AqzJ1.jpeg')
    content = models.TextField()
    style = models.JSONField(null=True, blank=True)
    transparent = models.BooleanField(default=True)
    category = models.CharField(max_length=50, choices=(('default', 'Default'), ('trending', 'Trending'), ('basic', 'Basic'), ('multicolor', 'Multicolor')))
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.content[:50]} (Font: {self.font}, Color: {self.color})"


class Sticker(models.Model):
    sticker_file = models.URLField(max_length=500)
    name = models.CharField(max_length=255, default='Default Sticker')
    duration = models.FloatField(null=True, blank=True)
    category = models.CharField(max_length=50, choices=(('trending', 'Trending'), ('easter_holiday', 'Easter Holiday'), ('fun', 'Fun'), ('troll_face', 'Troll Face'), ('gaming', 'Gaming'), ('emoji', 'Emoji')))
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Effect(models.Model):
    name = models.CharField(max_length=255, default='Default Effect')
    image = models.URLField(max_length=500, default='https://btfptkpngrtnnqweftvx.supabase.co/storage/v1/object/public/audio_files/image/oweiIPFVGAAIVCmcAIV4eAaK5FeGcLQe5AqzJ1.jpeg')
    duration = models.FloatField(null=True, blank=True)
    category = models.CharField(max_length=50, choices=(
        ('trending', 'Trending'),
        ('nightclub', 'Nightclub'),
        ('lens', 'Lens'),
        ('retro', 'Retro'),
        ('tv', 'TV'),
        ('star', 'Star'),
        ('trending_body', 'Trending Body'),
        ('mood_body', 'Mood Body'),
        ('mask_body', 'Mask Body'),
        ('selfie_body', 'Selfie Body'),
    ))
    config = models.JSONField(null=True, blank=True)
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.category}"


class Filter(models.Model):
    name = models.CharField(max_length=255, default='Default Filter')
    image = models.URLField(max_length=500, default='https://btfptkpngrtnnqweftvx.supabase.co/storage/v1/object/public/audio_files/image/oweiIPFVGAAIVCmcAIV4eAaK5FeGcLQe5AqzJ1.jpeg')
    category = models.CharField(
        max_length=50,
        choices=(
            ('featured', 'Featured'),
            ('life', 'Life'),
            ('scenery', 'Scenery'),
            ('movies', 'Movies'),
            ('retro', 'Retro'),
            ('style', 'Style'),
        )
    )
    config = models.JSONField(null=True, blank=True)
    intensity = models.FloatField(null=True, blank=True, default=1.0)
    is_delete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class EditSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, default=1)
    actions = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Edit session for {self.project.name} by {self.user.username}"


class Role(models.Model):
    role_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.role_name


