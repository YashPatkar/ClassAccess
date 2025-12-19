from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PDFSession(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, unique=True)
    file_path = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)