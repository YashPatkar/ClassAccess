from supabase import create_client
from django.conf import settings
import uuid
import logging

from core.exceptions import (
    StorageUploadError,
    StorageDeleteError,
    SignedUrlGenerationError,
)

logger = logging.getLogger(__name__)


class LazySupabaseClient:
    _client = None

    def _get_client(self):
        if self._client is None:
            self._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY,
            )
        return self._client

    def __getattr__(self, name):
        return getattr(self._get_client(), name)

supabase = LazySupabaseClient()

def upload_pdf_to_supabase(file_obj, code):
    """Upload PDF to Supabase storage.
    
    Args:
        file_obj: File object from request
        code: Session code (currently unused, kept for compatibility)
    
    Returns:
        str: Relative storage path (e.g., "sessions/uuid.pdf")
    
    Raises:
        StorageUploadError: If upload fails
    """
    if not file_obj:
        raise StorageUploadError("No file provided for upload.")
    
    path = f"sessions/{uuid.uuid4()}.pdf"
    
    try:
        supabase.storage.from_("pdf-sessions").upload(
            path,
            file_obj.read(),
            {"content-type": "application/pdf"},
        )
        return path
    except Exception as e:
        logger.error(f"PDF upload failed: {str(e)}")
        raise StorageUploadError(f"Failed to upload file: {str(e)}")


def delete_pdf_from_supabase(file_path: str):
    """
    Delete a PDF file from Supabase storage.
    
    Args:
        file_path: Relative storage path (e.g., "sessions/uuid.pdf")
    
    Raises:
        StorageDeleteError: If deletion fails
    """
    if not isinstance(file_path, str) or not file_path.strip():
        raise StorageDeleteError("Invalid file path provided for deletion.")
    
    try:
        supabase.storage.from_(settings.SUPABASE_BUCKET).remove([file_path])
    except Exception as e:
        logger.error(f"PDF deletion failed: {str(e)}")
        raise StorageDeleteError(f"Failed to delete file: {str(e)}")


def get_signed_url(file_path: str, expires_in: int = 3600) -> str:
    """
    Generate a signed URL for a PDF in Supabase storage.
    
    Args:
        file_path: Relative storage path (e.g., "sessions/uuid.pdf")
        expires_in: Expiration time in seconds (default: 3600)
    
    Returns:
        str: Signed URL
    
    Raises:
        SignedUrlGenerationError: If generation fails or invalid input
    """
    # Defensive validation
    if not isinstance(file_path, str):
        raise SignedUrlGenerationError(
            f"Expected file_path to be str, got {type(file_path).__name__}."
        )
    
    if not file_path.strip():
        raise SignedUrlGenerationError("file_path cannot be empty")
    
    try:
        res = supabase.storage.from_(settings.SUPABASE_BUCKET).create_signed_url(
            file_path,
            expires_in,
        )
        
        if not res or "signedURL" not in res:
            raise SignedUrlGenerationError("Invalid response from storage service")
        
        return res["signedURL"]
    except SignedUrlGenerationError:
        raise
    except Exception as e:
        logger.error(f"Signed URL generation failed: {str(e)}")
        raise SignedUrlGenerationError(f"Failed to generate signed URL: {str(e)}")
