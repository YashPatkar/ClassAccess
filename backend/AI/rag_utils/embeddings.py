from typing import List, Dict

from .llm_client import text_to_embedding


# -------- Chunking --------

def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50
) -> List[str]:
    """
    Split text into overlapping chunks.
    """

    if not text:
        return []

    words = text.split()
    chunks = []

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap

        if start < 0:
            start = 0

    return chunks


# -------- Embedding orchestration --------

async def text_to_chunks_with_embeddings(
    pages: List[Dict],
    pdf_id: int
) -> List[Dict]:
    """
    Convert extracted PDF pages into chunks with embeddings.

    Returns:
    [
        {
            "pdf_id": int,
            "page_number": int,
            "text": str,
            "embedding": List[float]
        }
    ]
    """

    results = []

    for page in pages:
        page_number = page["page_number"]
        text = page["text"]

        chunks = chunk_text(text)

        if not chunks:
            continue

        embeddings = await bulk_text_to_embeddings(chunks)

        for chunk_text_value, embedding in zip(chunks, embeddings):
            results.append({
                "pdf_id": pdf_id,
                "page_number": page_number,
                "text": chunk_text_value,
                "embedding": embedding,
            })

    return results


async def bulk_text_to_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Convert multiple texts into embeddings using embedding LLM.
    """

    if not texts:
        return []

    # delegate actual API call
    return await text_to_embedding(texts)
