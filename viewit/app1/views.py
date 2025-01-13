from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import random, os
from .models import pdffile
from django.conf import settings

def home(request):
    if request.method == 'POST':
        pdf = request.FILES['pdf']
        code = random.randint(1000, 99999)
        while pdffile.objects.filter(code=code).exists():
            code = random.randint(1000, 99999)
        
        media_path = os.path.join(settings.BASE_DIR, 'app1', 'media')
        if not os.path.exists(media_path):
            os.makedirs(media_path)
        
        # Saving pdf file in media
        fs = FileSystemStorage(location=media_path)
        filename = f"{code}.pdf"
        fs.save(filename, pdf)
        full_path = f"media/{filename}"
        print(full_path)
        print('=====================================================')

        pdf = pdffile.objects.create(code=str(code), path=full_path)
        print("PDF saved successfully")
        # saving code in session
        return render(request, 'app1/home.html', \
                      {'check': "created", 'code': code})
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
    elif request.session.get('user'):
         return render(request, 'app1/viewpdf.html', {
                'filepath': request.session['user']['path'],
                'code': request.session['user']['code'],
                'valid': True
        })
    return HttpResponse("Invalid request method", status=400)