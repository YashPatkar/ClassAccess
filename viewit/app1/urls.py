from django.urls import include, path
from app1 import views

urlpatterns = [
    path('', views.home, name = "home"),
    path('viewpdf/<str:id>/', views.viewpdf, name = "viewpdf"),
]