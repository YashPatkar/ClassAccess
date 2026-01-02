from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomManager(BaseUserManager):
    def create_user(self, email, password=None, role='student', **extra_fields):
        user = self.model(email=email, role=role.lower(), **extra_fields)
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
    
    USERNAME_FIELD = 'email'

    ROLE_CHOICES = [
        ('admin', 'admin'),
        ('teacher', 'teacher'),
        ('student', 'student')
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    REQUIRED_FIELDS = ['role']

    objects = CustomManager()

