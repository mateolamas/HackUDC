from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django import forms
import pandas as pd


df = pd.read_csv("../csv/electrodatos.csv")
consumo_por_hora = df.groupby(df['Hora'])['Consumo'].mean()

@csrf_exempt
def index(request):
    if request.method == 'POST':
        
        zone = request.POST.get('zone')
        csv_file = request.FILES.get('csv')
        
        df = pd.read_csv(csv_file, sep=';')

        df['Consumo_KWh'] = df['Consumo_KWh'].str.replace(',', '.')

        df_cut = df[['Fecha','Hora','Consumo_KWh']]

        df_cut = df_cut.merge(consumo_por_hora, how='left', left_on='Hora', right_index=True)
        print(df_cut)
        
        json_data = df_cut.to_json(orient='records')
        print(json_data)
        return JsonResponse(json_data, safe=False, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


class UploadFileForm(forms.Form):
    file = forms.FileField()