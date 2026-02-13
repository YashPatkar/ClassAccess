import os
import logging
from celery import Celery
from celery.schedules import crontab

logger = logging.getLogger(__name__)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

app = Celery("backend")
app.config_from_object("django.conf:settings", namespace="CELERY")

# Only autodiscover tasks if Celery is enabled and Redis is available
try:
    from django.conf import settings
    if getattr(settings, 'CELERY_ENABLED', False) and getattr(settings, 'REDIS_URL', None):
        app.autodiscover_tasks()
        
        app.conf.beat_schedule = {
            "cleanup-expired-pdfs": {
                "task": "Teacher.tasks.cleanup_expired_pdfs",
                "schedule": crontab(minute="*/15"),
            },
        }
    else:
        logger.info("Celery disabled")
except Exception as e:
    logger.warning(f"Celery initialization skipped: {str(e)}")