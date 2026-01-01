# Teacher/tasks.py
from celery import shared_task
from django.utils import timezone
from .models import PDFSession
from utils.supabase_client import delete_pdf_from_supabase

@shared_task
def cleanup_expired_pdfs():
    now = timezone.now()

    expired = (
        PDFSession.objects
        .filter(expires_at__lte=now, is_expired=False)
        .values_list("id", "file_path")[:100]
    )

    ids = []
    for pdf_id, path in expired:
        delete_pdf_from_supabase(path)
        ids.append(pdf_id)

    if ids:
        PDFSession.objects.filter(id__in=ids).update(is_expired=True)
