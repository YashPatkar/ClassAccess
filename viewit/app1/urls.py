from django.urls import include, path
from app1 import views

urlpatterns = [
    path('', views.home, name = "home"),
    path('viewpdf/', views.viewpdf, name = "viewpdf"),
]