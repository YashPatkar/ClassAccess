"""
Custom exception classes for the application.

These are used to standardize error handling across the backend
and provide better error messages to clients.
"""

from rest_framework.exceptions import APIException
from rest_framework import status


class StorageUploadError(APIException):
    """Raised when file upload to Supabase storage fails."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to upload file to storage."
    default_code = "storage_upload_error"


class StorageDeleteError(APIException):
    """Raised when file deletion from Supabase storage fails."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to delete file from storage."
    default_code = "storage_delete_error"


class SignedUrlGenerationError(APIException):
    """Raised when signed URL generation fails."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to generate signed URL for file access."
    default_code = "signed_url_error"


class RAGProcessingError(Exception):
    """
    Raised when RAG processing (embeddings, text extraction) fails.
    
    This is NOT an APIException — it's caught and logged in signals,
    not propagated to the API client.
    """
    pass
