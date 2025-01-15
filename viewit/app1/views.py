from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import random, os
from .models import pdffile
from django.conf import settings
from utils import encryption

def home(request):
    if request.method == 'POST':
        pdf = request.FILES['pdf']
        code = encryption.generate_code()
        
        while pdffile.objects.filter(code=code).exists():
            code = encryption.generate_code()
        
        media_path = os.path.join(settings.BASE_DIR, 'app1', 'media')
        if not os.path.exists(media_path):
            os.makedirs(media_path)
        
        fs = FileSystemStorage(location=media_path)
        filename = f"{code}.pdf"
        fs.save(filename, pdf)
        full_path = f"media/{filename}"

        pdf = pdffile.objects.create(code=str(code), path=full_path)
        return render(request, 'app1/home.html', {'check': "created", 'code': code})
    return render(request, 'app1/home.html', {'check': "notcreated"})

def viewpdf(request, code=None):
    if request.method == 'POST':
        if 'code' not in request.POST:
            return HttpResponse("Invalid request. No code found", status=400)
        code = request.POST['code']
        try:
            pdf_entry = get_object_or_404(pdffile, code=code)
            file_url = f"/{pdf_entry.path}"
            request.session['user'] = {'code': code, 'path': file_url}
            return render(request, 'app1/viewpdf.html', {
                'filepath': file_url,
                'code': code,
                'valid': True
            })
        except pdffile.DoesNotExist:
            return HttpResponse("Invalid code. No PDF found!", status=404)
        
    elif request.session.get('user') and str(code) == str(request.session['user']['code']):
         return render(request, 'app1/viewpdf.html', {
                'filepath': request.session['user']['path'],
                'code': request.session['user']['code'],
                'valid': True
        })
    return HttpResponse("Some Error Occured!!!", status=400)