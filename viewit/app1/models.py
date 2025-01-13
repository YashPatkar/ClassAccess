from django.db import models

# Create your models here.
class pdffile(models.Model):
    code = models.CharField(max_length=10, unique=True, null=False)
    date = models.DateTimeField(auto_now_add=True)
    path = models.CharField(max_length=100, null=False, unique=True)

    def __str__(self):
        return self.path