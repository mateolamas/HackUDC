from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def index(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Operación exitosa'}, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


