from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from django.http import JsonResponse
import json

from Teacher.models import PDFSession
from utils.redis_client import redis_client
from .ai_service import generate_summary_for_pdf
from rest_framework.throttling import SimpleRateThrottle

class AIOnMissThrottle(AnonRateThrottle):
    scope = "ai_summary"

    def allow_request(self, request, view):
        code = view.kwargs.get("code")
        if not code:
            return True

        cache_key = f"ai:summary:{code}"

        # If AI result is already cached → do NOT throttle
        if redis_client.exists(cache_key):
            return True

        # Otherwise apply normal anon throttling
        return super().allow_request(request, view)


class AISummaryView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AIOnMissThrottle]

    def get(self, request, code):
        cache_key = f"ai:summary:{code}"

        # 1️⃣ Cache check (fast path)
        cached = redis_client.get(cache_key)
        if cached:
            return JsonResponse({
                "status": "completed",
                **json.loads(cached)
            })

        # 2️⃣ Validate code
        try:
            pdf = PDFSession.objects.get(code=code)
        except PDFSession.DoesNotExist:
            return JsonResponse({"error": "Invalid code"}, status=404)

        # 3️⃣ Generate AI (SYNC, throttled by DRF)
        result = generate_summary_for_pdf(pdf)

        # 4️⃣ Cache result
        redis_client.setex(
            cache_key,
            3600,  # 1 hour
            json.dumps(result)
        )

        return JsonResponse({
            "status": "completed",
            **result
        })
