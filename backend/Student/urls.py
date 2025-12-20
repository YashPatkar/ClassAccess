from django.urls import path
from .views import StudentAccessView

urlpatterns = [
    path("access/", StudentAccessView.as_view()),
]
