from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
import random, os
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
    print(usercode)
    print('--------------------------------------------------------------------')
    if not usercode:
        return render(request, 'app1/view.html', {'filepath': None, 'valid': False})
    
    try:
        # Check if the record exists
        filepath = pdfpath.objects.get(code=usercode).path  
          # Retrieve the file path
        filepath = filepath.replace("\\", "/")  # Normalize the file path for compatibility
        print(f"Filepath retrieved: {filepath}")
        
        return render(request, 'app1/view.html', {'filepath': filepath, 'valid': True})
    except pdfpath.DoesNotExist:
        print("No PDF entry found for the provided code.")
        return render(request, 'app1/view.html', {'filepath': None, 'valid': False})