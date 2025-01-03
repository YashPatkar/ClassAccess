from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import random, os
from .models import pdfcode, pdfpath
from django.conf import settings

def home(request):
    if request.method == 'POST':
        pdf = request.FILES['pdf']
        code = random.randint(1000, 99999)
        while pdfcode.objects.filter(code=code).exists():
            code = random.randint(1000, 99999)
        
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)
        
        # Saving pdf file in media
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = f"{code}.pdf"
        fs.save(filename, pdf)
        full_path = os.path.join('app1', 'media', filename).replace('\\', '/')
        print(full_path)
        print('=====================================================')

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
    try:
        if not pdfcode.objects.filter(code=usercode).exists():
            print("No code found")
            return render(request, 'app1/view.html', {'filepath': None, 'valid': False})
        
        PDFPATH = pdfpath.objects.get(code__code=usercode)
        code = PDFPATH.code.code
        request.session['access'] = 'granted'
        return render(request, 'app1/view.html', {'code': code, 'valid': True})
    except pdfpath.DoesNotExist:
        print("No PDF entry found for the provided code.")
        return render(request, 'app1/view.html', {'filepath': None, 'valid': False})
    
def pdfValidation(request, code):
    if request.session.get('access') == 'granted':
        PDFPATH = get_object_or_404(pdfpath, code__code=code)
        filepath = PDFPATH.path
        return render(request, 'app1/viewpdf.html', {'filepath': filepath})
    return HttpResponse('Some Error is there')