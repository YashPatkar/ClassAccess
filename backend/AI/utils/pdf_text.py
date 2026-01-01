# AI/utils/pdf_text.py
import pdfplumber
import requests
import io

def extract_text_from_pdf(pdf_url: str) -> str:
    response = requests.get(pdf_url)
    response.raise_for_status()

    with pdfplumber.open(io.BytesIO(response.content)) as pdf:
        pages = [page.extract_text() or "" for page in pdf.pages]

    return "\n".join(pages)
