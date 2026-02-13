import logging
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SignupSerializer, LoginSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.throttling import SimpleRateThrottle

logger = logging.getLogger(__name__)
User = get_user_model()

class AuthRateThrottle(SimpleRateThrottle):
    '''Rate limit for signup and login api'''
    scope = "auth"

    def get_cache_key(self, request, view):
        return self.get_ident(request)
    
class Signup(APIView):
    """User registration endpoint with JWT token generation."""
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]
    
    def post(self, request):
        data = request.data
        serializer = SignupSerializer(data=data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if not data.get("password"):
            return Response(
                {"error": "Password is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # create user
            user = User(
                email=data["email"],
                role="teacher"
            )
            user.set_password(data["password"])
            user.save()

            # generate JWT
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "role": user.role,
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Signup failed: {str(e)}")
            return Response(
                {"error": "Failed to create account. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class Login(APIView):
    """User authentication endpoint with JWT token generation."""
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.filter(email=email).first()
            if not user or not user.check_password(password):
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Login failed: {str(e)}")
            return Response(
                {"error": "Login failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
