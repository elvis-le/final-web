# Generated by Django 4.2.6 on 2024-09-20 02:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='text',
            name='color',
            field=models.CharField(default='white', max_length=255),
        ),
        migrations.AddField(
            model_name='text',
            name='duration',
            field=models.IntegerField(default=5),
        ),
        migrations.AddField(
            model_name='text',
            name='font',
            field=models.CharField(default='Arial', max_length=255),
        ),
        migrations.AddField(
            model_name='text',
            name='height',
            field=models.IntegerField(default=200),
        ),
        migrations.AddField(
            model_name='text',
            name='stroke_color',
            field=models.CharField(default='white', max_length=255),
        ),
        migrations.AddField(
            model_name='text',
            name='stroke_width',
            field=models.IntegerField(default=2),
        ),
        migrations.AddField(
            model_name='text',
            name='transparent',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='text',
            name='width',
            field=models.IntegerField(default=500),
        ),
    ]
