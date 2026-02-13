import asyncio
import logging
from django.db.models.signals import post_save
from django.dispatch import receiver

from Teacher.models import PDFSession
from AI.rag_utils.extraction.pdf_text_extractor import extract_text_from_pdf
from AI.rag_utils.embeddings import text_to_chunks_with_embeddings
from AI.rag_utils.vector_store import store_embeddings
from core.exceptions import RAGProcessingError

logger = logging.getLogger(__name__)


@receiver(post_save, sender=PDFSession)
def build_rag_on_pdf_upload(sender, instance, created, **kwargs):
    """
    Build RAG (Retrieval-Augmented Generation) index after PDF upload.
    
    If any step fails, the error is logged but NOT propagated to prevent
    upload endpoint from failing.
    """
    if not created:
        return

    # Defensive validation: ensure file_path is valid before proceeding
    if not isinstance(instance.file_path, str) or not instance.file_path.strip():
        logger.warning(f"RAG skipped - invalid file_path for session {instance.id}")
        return

    async def _run():
        try:
            # 1. Extract text (page-level)
            pages = await extract_text_from_pdf(instance.file_path)

            # 2. Chunk + embed
            chunks_with_embeddings = await text_to_chunks_with_embeddings(
                pages=pages,
                pdf_id=instance.id,
            )

            if not chunks_with_embeddings:
                return

            # 3. Store embeddings
            await store_embeddings(chunks_with_embeddings)
            
        except Exception as e:
            # Log error but don't crash - upload already succeeded
            logger.error(f"RAG processing failed for session {instance.id}: {str(e)}")

    try:
        asyncio.run(_run())
    except Exception as e:
        logger.error(f"Failed to run RAG processing for session {instance.id}: {str(e)}")
