from django.urls import include, path
from app1 import views

urlpatterns = [
    path('', views.home, name = "home"),
    path('viewpdf/<str:code>/', views.viewpdf, name = "viewpdf"),
]