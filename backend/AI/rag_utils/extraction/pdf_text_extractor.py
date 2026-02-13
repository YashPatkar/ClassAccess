import io
import logging
import httpx
import pdfplumber

from utils.supabase_client import get_signed_url
from core.exceptions import RAGProcessingError, SignedUrlGenerationError

logger = logging.getLogger(__name__)


async def extract_text_from_pdf(file_path: str) -> list[dict]:
    """
    Extract text page-by-page from a PDF stored in Supabase.
    
    Args:
        file_path: Relative storage path (e.g., "sessions/uuid.pdf")
    
    Returns:
        List of dicts with page_number and text
    
    Raises:
        RAGProcessingError: If extraction fails
    """
    try:
        signed_url = get_signed_url(file_path)
    except SignedUrlGenerationError as e:
        logger.error(f"Failed to get signed URL: {str(e)}")
        raise RAGProcessingError(f"Cannot access PDF file: {str(e)}")
    except Exception as e:
        logger.error(f"Error getting signed URL: {str(e)}")
        raise RAGProcessingError(f"Failed to access PDF: {str(e)}")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(signed_url)
            response.raise_for_status()
    except httpx.HTTPError as e:
        logger.error(f"HTTP error downloading PDF: {str(e)}")
        raise RAGProcessingError(f"Failed to download PDF: {str(e)}")
    except Exception as e:
        logger.error(f"Error downloading PDF: {str(e)}")
        raise RAGProcessingError(f"Failed to download PDF: {str(e)}")

    pages = []

    try:
        with pdfplumber.open(io.BytesIO(response.content)) as pdf:
            for idx, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                pages.append({
                    "page_number": idx + 1,
                    "text": text.strip()
                })
        
        return pages
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise RAGProcessingError(f"Failed to extract text from PDF: {str(e)}")
