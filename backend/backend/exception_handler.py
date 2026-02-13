"""
Custom DRF exception handler.

Standardizes error responses across the API - returns clean {"error": "message"}
format for the frontend to display.
"""

import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns clean error messages for frontend.
    
    Returns:
        Response with {"error": "message"} format
    """
    # Call DRF's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # DRF handled it - return as is
        return response
    
    # DRF didn't handle it - log and return clean message
    logger.error(f"Unhandled exception: {exc.__class__.__name__}: {str(exc)}")
    
    # In DEBUG mode, re-raise so we see the full traceback in console
    if settings.DEBUG:
        raise exc
    
    # In production, return a generic error message to frontend
    return Response(
        {"error": "An error occurred processing your request."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
