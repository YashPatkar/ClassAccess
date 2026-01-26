from typing import List

from llama_index.core import Document, VectorStoreIndex
from llama_index.embeddings.huggingface import HuggingFaceEmbedding


# Load embedding model once
embedding_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def build_pdf_index(pages: List[dict], pdf_id: int) -> VectorStoreIndex | None:
    """
    Build a vector index for a PDF.

    pages = [
        { "page_number": 1, "text": "..." },
        ...
    ]
    """

    documents: list[Document] = []

    for page in pages:
        text = page.get("text", "").strip()
        if not text:
            continue

        documents.append(
            Document(
                text=str(text),
                extra_info={
                    "pdf_id": str(pdf_id),
                    "page_number": str(page["page_number"]),
                }
            )
        )

    if not documents:
        return None

    index = VectorStoreIndex.from_documents(
        documents,
        embed_model=embedding_model
    )

    return index
