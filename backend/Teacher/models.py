from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PDFSession(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, unique=True)
    file_path = models.CharField(max_length=500)
    original_file_name = models.CharField(max_length=200)
    expires_at = models.DateTimeField()
    is_expired = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.original_file_name} - {self.is_expired} expiry"