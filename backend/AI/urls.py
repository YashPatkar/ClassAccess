# AI/urls.py
from django.urls import path
from .views import AISummaryView

urlpatterns = [
    path("summary/<str:code>/", AISummaryView.as_view()),
]
