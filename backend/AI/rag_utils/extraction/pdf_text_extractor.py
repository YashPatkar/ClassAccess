import io
import httpx
import pdfplumber

from utils.supabase_client import get_signed_url


async def extract_text_from_pdf(file_path: str) -> list[dict]:
    """
    Extract text page-by-page from a PDF stored in Supabase.
    """

    signed_url = get_signed_url(file_path)

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(signed_url)
        response.raise_for_status()

    pages = []

    with pdfplumber.open(io.BytesIO(response.content)) as pdf:
        for idx, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            pages.append({
                "page_number": idx + 1,
                "text": text.strip()
            })

    return pages
