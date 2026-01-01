from django.urls import path
from .views import FileStore
from rest_framework.routers import DefaultRouter
from .views import TeacherPDFSessionViewSet

urlpatterns = [
    path('upload/', FileStore.as_view())
]

router = DefaultRouter()
router.register(
    "pdf-sessions",
    TeacherPDFSessionViewSet,
    basename="teacher-pdf"
)

urlpatterns += router.urls