import random
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from utils.supabase_client import upload_pdf_to_supabase
from .models import PDFSession
from .serializers import FileStoreSerializer
from .permission import IsTeacher


class FileStore(generics.CreateAPIView):
    serializer_class = FileStoreSerializer
    queryset = PDFSession.objects.all()
    permission_classes = [IsAuthenticated, IsTeacher]

    def perform_create(self, serializer):
        code = str(random.randint(100000, 999999))
        file_path = self.request.FILES["file_path"]

        path = upload_pdf_to_supabase(file_path, code)

        serializer.save(
            teacher=self.request.user,
            code=code,
            file_path=path
        )
