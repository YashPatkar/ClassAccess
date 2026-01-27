import asyncio
from typing import List, Dict

from utils.supabase_client import supabase


# ---------------------------------------------------------
# Insert embeddings (PDF ingestion)
# ---------------------------------------------------------

async def store_embeddings(chunks: List[Dict]) -> None:
    """
    Store chunk embeddings into Supabase pgvector table.

    chunks = [
        {
            "pdf_id": int,
            "page_number": int,
            "text": str,
            "embedding": List[float]
        }
    ]
    """

    if not chunks:
        return

    payload = [
        {
            "pdf_id": item["pdf_id"],
            "page_number": item["page_number"],
            "chunk_text": item["text"],
            "embedding": item["embedding"],
        }
        for item in chunks
    ]

    # Supabase SDK is sync → run in thread
    await asyncio.to_thread(
        lambda: supabase
        .table("pdf_embeddings")
        .insert(payload)
        .execute()
    )


# ---------------------------------------------------------
# Similarity search (question answering)
# ---------------------------------------------------------

async def search_similar_embeddings(
    pdf_id: int,
    query_embedding: List[float],
    top_k: int = 4,
) -> List[Dict]:
    """
    Perform semantic similarity search using pgvector RPC.

    Returns:
    [
        {
            "chunk_text": str,
            "page_number": int,
            "similarity": float
        }
    ]
    """

    def _rpc_call():
        return (
            supabase.rpc(
                "match_pdf_embeddings",
                {
                    "query_embedding": query_embedding,
                    "match_pdf_id": pdf_id,
                    "match_count": top_k,
                },
            )
            .execute()
        )

    response = await asyncio.to_thread(_rpc_call)

    return response.data or []
