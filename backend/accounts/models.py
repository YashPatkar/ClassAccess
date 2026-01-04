from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomManager(BaseUserManager):
    def create_user(self, email, password=None, role="student", **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    ROLE_CHOICES = [
        ("admin", "admin"),
        ("teacher", "teacher"),
        ("student", "student"),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    objects = CustomManager()