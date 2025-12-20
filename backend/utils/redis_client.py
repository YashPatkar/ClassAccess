import redis
import os
import json

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True
)

def get_pdf_session(code):
    data = redis_client.get(f"pdf:{code}")
    return json.loads(data) if data else None

def set_pdf_session(code, data, ttl=3600):
    redis_client.setex(f"pdf:{code}", ttl, json.dumps(data))