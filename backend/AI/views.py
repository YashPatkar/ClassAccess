from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Teacher.models import PDFSession
from .rag.qa_engine import answer_question
from rest_framework.permissions import AllowAny

from rest_framework.throttling import AnonRateThrottle

class AIQuestionRateThrottle(AnonRateThrottle):
    scope = "ai_question"

class AskPDFQuestionView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AIQuestionRateThrottle]

    def post(self, request):
        code = request.data.get("code")
        question = request.data.get("question")

        if not code or not question:
            return Response(
                {"error": "code and question are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            pdf_session = PDFSession.objects.get(
                code=code,
                is_expired=False
            )
        except PDFSession.DoesNotExist:
            return Response(
                {"error": "Invalid or expired session code"},
                status=status.HTTP_404_NOT_FOUND
            )

        answer = answer_question(
            pdf_id=pdf_session.id,
            question=question
        )

        print(answer)

        return Response(
            {"answer": answer},
            status=status.HTTP_200_OK
        )
