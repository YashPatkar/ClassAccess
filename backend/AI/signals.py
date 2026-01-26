from django.db.models.signals import post_save
from django.dispatch import receiver

from Teacher.models import PDFSession
from .extraction.pdf_text_extractor import extract_text_by_page
from .rag.document_indexer import build_pdf_index
from .rag.index_store import INDEX_STORE


@receiver(post_save, sender=PDFSession)
def build_rag_pipeline_on_pdf_upload(sender, instance, created, **kwargs):
    if not created:
        return

    try:
        pages = extract_text_by_page(instance.file_path)

        index = build_pdf_index(
            pages=pages,
            pdf_id=instance.id
        )

        if index:
            INDEX_STORE[instance.id] = index
        print(index)

    except Exception as e:
        print(f"[RAG ERROR] PDFSession {instance.id}: {str(e)}")
