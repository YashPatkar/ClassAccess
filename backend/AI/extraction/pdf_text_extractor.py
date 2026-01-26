import io
import requests
import pdfplumber

from utils.supabase_client import get_signed_url


def extract_text_by_page(file_path: str) -> list[dict]:
    """
    Extract text page-by-page from a PDF stored in Supabase.
    """

    signed_url = get_signed_url(file_path)

    response = requests.get(signed_url, timeout=30)
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
