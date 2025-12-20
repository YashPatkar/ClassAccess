from rest_framework import serializers
from .models import PDFSession
from django.utils import timezone

class FileStoreSerializer(serializers.ModelSerializer):
    file_path = serializers.FileField(write_only=True)
    code = serializers.CharField(read_only=True)
    class Meta:
        model = PDFSession
        fields = ["file_path", "expires_at", "code"]

    def validate_expires_at(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError(
                "Expiry time must be in the future"
            )
        return value
