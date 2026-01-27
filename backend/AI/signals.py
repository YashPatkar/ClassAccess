import asyncio
from django.db.models.signals import post_save
from django.dispatch import receiver

from Teacher.models import PDFSession
from AI.rag_utils.extraction.pdf_text_extractor import extract_text_from_pdf
from AI.rag_utils.embeddings import text_to_chunks_with_embeddings
from AI.rag_utils.vector_store import store_embeddings


@receiver(post_save, sender=PDFSession)
def build_rag_on_pdf_upload(sender, instance, created, **kwargs):
    if not created:
        return

    async def _run():
        # 1. Extract text (page-level)
        pages = await extract_text_from_pdf(instance.file_path)

        # 2. Chunk + embed
        chunks_with_embeddings = await text_to_chunks_with_embeddings(
            pages=pages,
            pdf_id=instance.id,
        )

        if not chunks_with_embeddings:
            return

        # 3. Store embeddings (will be added later)
        await store_embeddings(chunks_with_embeddings)

    # Django signals are sync → bridge to async
    asyncio.run(_run())
