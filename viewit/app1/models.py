from django.db import models

# Create your models here.
class pdfcode(models.Model):
    code = models.CharField(max_length=5, unique=True, null=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

class pdfpath(models.Model):
    code = models.OneToOneField(pdfcode, on_delete=models.CASCADE)
    path = models.CharField(max_length=100, null=False, unique=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.path