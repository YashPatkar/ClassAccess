# AI/urls.py
from django.urls import path
from .views import AskPDFQuestionView

urlpatterns = [
    path("ask/", AskPDFQuestionView.as_view()),
]
