# Generated by Django 4.2.6 on 2024-09-20 02:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_remove_text_height_remove_text_width_text_fontsize'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='text',
            name='name',
        ),
    ]
