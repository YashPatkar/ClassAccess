import asyncio
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle

from Teacher.models import PDFSession
from AI.rag_utils.embeddings import bulk_text_to_embeddings
from AI.rag_utils.llm_client import generate_answer
from AI.rag_utils.vector_store import search_similar_embeddings  # later


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
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            pdf_session = PDFSession.objects.get(
                code=code,
                is_expired=False,
            )
        except PDFSession.DoesNotExist:
            return Response(
                {"error": "Invalid or expired session code"},
                status=status.HTTP_404_NOT_FOUND,
            )

        async def _run():
            # 1. Embed question
            question_embedding = (
                await bulk_text_to_embeddings([question])
            )[0]

            # 2. Retrieve relevant chunks (placeholder)
            results = await search_similar_embeddings(
                pdf_id=pdf_session.id,
                query_embedding=question_embedding,
                top_k=4,
            )

            # TEMP: until vector store is added
            context_text = "\n\n".join(
                f"(Page {item['page_number']}) {item['chunk_text']}"
                for item in results
            )
            
            # 3. Generate answer
            return await generate_answer(
                context=context_text,
                question=question,
            )

        answer = asyncio.run(_run())

        return Response(
            {"answer": answer},
            status=status.HTTP_200_OK,
        )
