from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import random, os
import datetime as dt
# Create your views here.

store_code = set()

def home(request):
    if request.method == 'POST':
        pdf = request.FILES['pdf']
        code = random.randint(1000, 99999)
        while code in store_code:
            code = random.randint(1000, 99999)
        store_code.add(code)
        if not os.path.exists('media'):
            os.makedirs('media')
        fs = FileSystemStorage(location='media')
        filename = f"{code}.pdf"
        fs.save(filename, pdf)
        full_path = f"{os.getcwd()}\media\{filename}.pdf"
        print(full_path)
        request.session['user'] = {'code': code, 'starttime': str(dt.datetime.now()), 
                                   'filepath': full_path} 

        return render(request, 'app1/home.html', \
                      {'check': "created", 'code': request.session['user']['code']})
    return render(request, 'app1/home.html', {'check': "notcreated"})

def viewpdf(request, id):
    if request.method == "POST" and os.path.exists(f'media/{id}.pdf'):
        filepath = os.path.join(os.getcwd(), 'media', f"{id}.pdf")
        return render(request, 'app1/view.html', {'filepath': filepath, 'valid': True})
    return render(request, 'app1/view.html', {'filepath': None, 'valid': False})