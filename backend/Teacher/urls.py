from django.urls import path
from .views import FileStore

urlpatterns = [
    path('upload/', FileStore.as_view())
]