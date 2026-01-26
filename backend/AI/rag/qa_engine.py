from llama_index.core import Settings
from llama_index.llms.groq import Groq

from .index_store import INDEX_STORE


# LLM setup (global, once)
Settings.llm = Groq(
    model="openai/gpt-oss-120b",
    temperature=0.2
)


SYSTEM_PROMPT = """
You are a professional teaching assistant for a PDF question-answering system.

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
"""

def answer_question(pdf_id: int, question: str) -> str:
    """
    Fetch index → query → return answer
    """

    index = INDEX_STORE.get(pdf_id)
    if not index:
        return "Good Teacher is not available. Please try again."

    query_engine = index.as_query_engine(
        similarity_top_k=4,
        system_prompt=SYSTEM_PROMPT
    )

    response = query_engine.query(question)
    return str(response).strip()
