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

def delete_pdf_from_supabase(file_path: str):
    """
    file_path example:
    sessions/af8c714f-f26b-4c5c-a121-90c73a5eed47.pdf
    """
    res = supabase.storage.from_(settings.SUPABASE_BUCKET).remove([file_path])

def get_signed_url(file_path: str, expires_in: int = 3600) -> str:
    """
    file_path example:
    sessions/af8c714f-f26b-4c5c-a121-90c73a5eed47.pdf
    """
    res = supabase.storage.from_(settings.SUPABASE_BUCKET).create_signed_url(
        file_path,
        expires_in
    )
    return res["signedURL"]