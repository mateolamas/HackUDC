from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django import forms
import pandas as pd

with open('../csv/electrodatos.csv', "r") as csv_file:
    glob = csv_file.readlines()

@csrf_exempt
def index(request):
    if request.method == 'POST':
        
        zone = request.POST.get('zone')
        csv_file = request.FILES.get('csv')
        
        df = pd.read_csv(csv_file, sep=';')

        df['Consumo_KWh'] = df['Consumo_KWh'].str.replace(',', '.')

        df_cut = df[['Fecha','Hora','Consumo_KWh']]
        
        json_data = df_cut.to_json(orient='records')
        print(json_data)
        return JsonResponse(json_data, safe=False, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


class UploadFileForm(forms.Form):
    file = forms.FileField()