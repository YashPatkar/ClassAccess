#!/bin/sh
set -e
echo "DATABASE_URL=$DATABASE_URL"
echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
