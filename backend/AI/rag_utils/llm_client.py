import httpx
from typing import List

from django.conf import settings


# ------------------------------------------------------------------
# Configuration (comes ONLY from settings / env)
# ------------------------------------------------------------------

GROQ_API_KEY = settings.GROQ_API_KEY

EMBEDDING_MODEL = settings.GROQ_EMBEDDING_MODEL
QA_MODEL = settings.GROQ_QA_MODEL

GROQ_BASE_URL = "https://api.groq.com/openai/v1"


HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

from sklearn.feature_extraction.text import TfidfVectorizer

_VECTOR_DIM = 1536  # MUST match pgvector dimension

_vectorizer = TfidfVectorizer(
    max_features=_VECTOR_DIM,
    stop_words="english"
)

async def text_to_embedding(texts: List[str]) -> List[List[float]]:
    vectors = _vectorizer.fit_transform(texts).toarray()

    fixed_vectors = []
    for vec in vectors:
        if len(vec) < _VECTOR_DIM:
            # pad with zeros
            vec = list(vec) + [0.0] * (_VECTOR_DIM - len(vec))
        else:
            # trim if longer
            vec = vec[:_VECTOR_DIM]

        fixed_vectors.append(vec)

    return fixed_vectors

# ------------------------------------------------------------------
# Question Answering (RAG generation)
# ------------------------------------------------------------------

SYSTEM_PROMPT = """
You are a professional teaching assistant for a PDF question-answering system and your name is Good Teacher.

Your job is to answer questions STRICTLY using the provided document context.

Rules you must follow at all times:
1. Use ONLY the information present in the context.
2. Do NOT use outside knowledge.
3. Do NOT guess or hallucinate.
4. If the answer is not present in the document, respond with exactly:
   "This information is not present in the document."
5. Keep answers clear, concise, and well structured.
6. Prefer short paragraphs.
7. Use bullet points when listing information.
8. If the user asks for a short answer, respond in under 15 words.
9. If the user asks to explain a page, summarize only that page’s content.
10. Never include personal opinions or assumptions.
11. Do not mention that you are an AI model.
12. Do not repeat the question in the answer.

Tone:
- Calm
- Helpful
- Teacher-like
- Simple and clear

Formatting:
- Use plain text
- Preserve line breaks
- Avoid markdown symbols unless listing items
""".strip()


async def generate_answer(
    context: str,
    question: str,
) -> str:
    """
    Generate an answer using retrieved document context.
    """

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": f"""
Context:
{context}

Question:
{question}
""".strip(),
        },
    ]

    payload = {
        "model": QA_MODEL,
        "messages": messages,
        "temperature": 0.2,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{GROQ_BASE_URL}/chat/completions",
            headers=HEADERS,
            json=payload,
        )
        response.raise_for_status()

    return (
        response.json()
        ["choices"][0]
        ["message"]["content"]
        .strip()
    )
