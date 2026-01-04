# utils/redis_client.py
import os
import redis
import json
from django.conf import settings

redis_client = None

if settings.REDIS_URL:
    redis_client = redis.from_url(
        settings.REDIS_URL,
        decode_responses=True
    )

def get_pdf_session(code):
    if not redis_client:
        return None

    data = redis_client.get(f"pdf:{code}")
    return json.loads(data) if data else None

def set_pdf_session(code, data, ttl=3600):
    if not redis_client:
        return

    redis_client.setex(
        f"pdf:{code}",
        ttl,
        json.dumps(data)
    )
