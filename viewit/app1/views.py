from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import random, os
import datetime as dt
from .models import pdfcode, pdfpath

def home(request):
    if request.method == 'POST':
        pdf = request.FILES['pdf']
        code = random.randint(1000, 99999)
        while pdfcode.objects.filter(code=code).exists():
            code = random.randint(1000, 99999)
        
        if not os.path.exists('media'):
            os.makedirs('media')
        
        # Saving pdf file in media
        fs = FileSystemStorage(location='media')
        filename = f"{code}.pdf"
        fs.save(filename, pdf)
        full_path = os.path.join('media', filename)

        # Generate code for the pdf
        pdfCode = pdfcode.objects.create(code=code)

        # Save the path of the pdf
        pdfpath.objects.create(code=pdfCode, path=full_path)
        print("PDF saved successfully")
        # saving code in session
        request.session['user'] = {'code': code}
        
        return render(request, 'app1/home.html', \
                      {'check': "created", 'code': code})
    return render(request, 'app1/home.html', {'check': "notcreated"})

def viewpdf(request):
    usercode = request.GET.get('code')
    if os.path.exists(f'media/{usercode}.pdf') and pdfpath.objects.filter(code=usercode).exists():
        try:
            pdfCode = pdfcode.objects.get(code=usercode).code
            filepath = pdf_entry.path
        except pdfpath.DoesNotExist:
            filepath = None
        return render(request, 'app1/view.html', {'filepath': filepath, 'valid': True})
    return render(request, 'app1/view.html', {'filepath': None, 'valid': False})