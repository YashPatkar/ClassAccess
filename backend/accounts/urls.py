from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import Signup, Login

urlpatterns = [
    path('signup/', Signup.as_view())
    ,path('login/', Login.as_view())
    ,path('refresh/', TokenRefreshView.as_view())
]