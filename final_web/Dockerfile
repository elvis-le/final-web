FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev gcc

RUN apt-get update && apt-get install -y imagemagick
RUN apt-get update && apt-get install -y ffmpeg

COPY ../requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install supabase

COPY . /app/

WORKDIR /app

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "final_web.asgi:application"]
