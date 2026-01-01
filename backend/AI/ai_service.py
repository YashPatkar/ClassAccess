import io
import json
import requests
import pdfplumber
from groq import Groq
from django.conf import settings

from utils.supabase_client import get_signed_url

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_summary_for_pdf(pdf):
    signed_url = get_signed_url(pdf.file_path)

    response = requests.get(signed_url)
    response.raise_for_status()

    text = ""
    with pdfplumber.open(io.BytesIO(response.content)) as pdf_file:
        for page in pdf_file.pages:
            text += page.extract_text() or ""

    prompt = f"""
Return ONLY valid JSON:
{{
  "summary": "5-6 sentence summary",
  "key_points": ["point1", "point2", "point3"]
}}

TEXT:
{text[:12000]}
"""

    res = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
    )

    return json.loads(res.choices[0].message.content)
