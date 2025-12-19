from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from utils.supabase_client import supabase
from .models import PDFSession

class AccessPDF(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        code = request.data.get("code")

        session = PDFSession.objects.filter(code=code).first()
        if not session or session.expires_at <= timezone.now():
            return Response({"error": "Invalid or expired"}, status=403)

        remaining = int((session.expires_at - timezone.now()).total_seconds())
        expires_in = min(600, remaining)  # max 10 min

        signed = supabase.storage.from_("pdf-sessions").create_signed_url(
            session.file_path,
            expires_in
        )

        return Response({"url": signed["signedURL"]})
