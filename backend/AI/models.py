# AI/models.py
from django.db import models
from Teacher.models import PDFSession

class PDFAIResult(models.Model):
    pdf_session = models.OneToOneField(
        PDFSession,
        on_delete=models.CASCADE,
        related_name="ai_result"
    )
    summary = models.TextField()
    key_points = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
