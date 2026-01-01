# AI/prompts.py
SUMMARY_PROMPT = """
You are an educational assistant.

From the text below, return VALID JSON with:
- summary: 5–6 sentence concise summary
- key_points: 5–7 bullet points

Rules:
- Student friendly language
- No markdown
- JSON only

TEXT:
{content}
"""
