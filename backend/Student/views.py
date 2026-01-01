from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.utils.timezone import now
from .serializers import StudentAccessSerializer
from Teacher.models import PDFSession
from utils.supabase_client import supabase
from utils.redis_client import set_pdf_session, get_pdf_session


class StudentAccessView(GenericAPIView):
    serializer_class = StudentAccessSerializer
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data["code"]
        now_ts = int(now().timestamp())

        cached = get_pdf_session(code)
        if cached:
            if cached["expires_at"] <= now_ts:
                return Response({"error": "Session expired"}, status=400)
            return Response({"url": cached["signed_url"], "code": code})

        session = PDFSession.objects.filter(code=code).first()
        if not session:
            return Response({"error": "Invalid code"}, status=404)

        if session.expires_at.timestamp() <= now_ts:
            return Response({"error": "Session expired"}, status=400)

        remaining_seconds = int(
            (session.expires_at - now()).total_seconds()
        )

        signed = supabase.storage.from_("pdf-sessions").create_signed_url(
            session.file_path,
            min(remaining_seconds, 3600)
        )

        data = {
            "file_path": session.file_path,
            "expires_at": int(session.expires_at.timestamp()),
            "signed_url": signed["signedURL"]
        }

        set_pdf_session(code, data)

        return Response({"url": signed["signedURL"], "code": code})
