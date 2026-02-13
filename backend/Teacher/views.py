import random
import logging
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from utils.supabase_client import upload_pdf_to_supabase, delete_pdf_from_supabase
from core.exceptions import StorageUploadError, StorageDeleteError
from .models import PDFSession
from .serializers import FileStoreSerializer, PDFSessionSerializer
from .permission import IsTeacher
from rest_framework import mixins, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser

logger = logging.getLogger(__name__)


class FileStore(generics.CreateAPIView):
    '''
        File upload by teacher
    '''
    serializer_class = FileStoreSerializer
    queryset = PDFSession.objects.all()
    permission_classes = [IsAuthenticated, IsTeacher]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        """Override create to handle upload failures gracefully."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            self.perform_create(serializer)
        except StorageUploadError as e:
            # Storage-specific error with custom message
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            # Unexpected error - log and return generic message
            logger.error(f"Upload failed: {str(e)}")
            return Response(
                {"error": "Failed to upload PDF. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def perform_create(self, serializer):
        code = str(random.randint(100000, 999999))
        
        file = serializer.validated_data["file_path"]
        
        path = upload_pdf_to_supabase(file, code)

        serializer.save(
            teacher=self.request.user,
            code=code,
            file_path=path,
            original_file_name=file.name
        )

class TeacherPDFSessionViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    '''
        Dashboard viewset for teachers
    '''
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsTeacher]
    serializer_class = PDFSessionSerializer

    def get_queryset(self):
        return (
            PDFSession.objects
            .filter(teacher=self.request.user)
            .order_by("-created_at")
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        try:
            delete_pdf_from_supabase(instance.file_path)
        except (StorageDeleteError, Exception) as e:
            # Log but continue - mark as expired even if storage deletion fails
            logger.warning(f"PDF deletion from storage failed: {str(e)}")

        instance.is_expired = True
        instance.save(update_fields=["is_expired"])

        return Response(status=204)