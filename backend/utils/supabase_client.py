from supabase import create_client
from django.conf import settings
import uuid 
from rest_framework.response import Response

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
)


def upload_pdf_to_supabase(file_obj, code):
    path = f"sessions/{uuid.uuid4()}.pdf"

    try:
        supabase.storage.from_("pdf-sessions").upload(path, file_obj.read(), {"content-type": "application/pdf"})
        return path
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=400
        )
