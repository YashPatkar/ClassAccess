import random
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from utils.supabase_client import upload_pdf_to_supabase, delete_pdf_from_supabase
from .models import PDFSession
from .serializers import FileStoreSerializer, PDFSessionSerializer
from .permission import IsTeacher
from rest_framework import mixins, viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response


class FileStore(generics.CreateAPIView):
    '''
        File upload by teacher
    '''
    serializer_class = FileStoreSerializer
    queryset = PDFSession.objects.all()
    permission_classes = [IsAuthenticated, IsTeacher]
    parser_classes = [MultiPartParser, FormParser]

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
        delete_pdf_from_supabase(instance.file_path)

        instance.is_expired = True
        instance.save(update_fields=["is_expired"])

        return Response(status=204)