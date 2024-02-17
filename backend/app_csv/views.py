from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django import forms
import pandas as pd
import requests
from datetime import datetime

df = pd.read_csv("../csv/electrodatos.csv")
consumo_por_hora = df.groupby(df['Hora'])['Consumo'].mean()

# MockUp
csv_1 = {'fecha' : '14/05/2022', 'consumo_total':'1.765'}
csv_2 = {'fecha' : '23/12/2019', 'consumo_total':'1.433'}
csv_3 = {'fecha' : '01/06/2015', 'consumo_total':'3.332'}
csv_4 = {'fecha' : '18/11/2023', 'consumo_total':'2.566'}
csv_user = {}


def llamada_API(dia):
    dia_obj = datetime.strptime(dia, '%d/%m/%Y')
    dia_formateado = dia_obj.strftime('%Y-%m-%d')

    url = 'https://api.esios.ree.es/archives/70/download_json?date=' + dia_formateado

    response = requests.get(url)

    data = response.json()
    data = data['PVPC']
    l = []
    for i in range(len(data)):
        dato = float(data[i]['PCB'].replace(",", ".")) / 1000
        l.append(dato)

    return l

@csrf_exempt
def index(request):
    global csv_user

    if request.method == 'GET':
        
        lista_datos = [csv_user, csv_1, csv_2, csv_3]

        return JsonResponse(lista_datos, safe=False, status=200)

    if request.method == 'POST':
        
        zone = request.POST.get('zone')
        csv_file = request.FILES.get('csv')
        
        df = pd.read_csv(csv_file, sep=';')

        df['Consumo_KWh'] = df['Consumo_KWh'].str.replace(',', '.')

        df_cut = df[['Fecha','Hora','Consumo_KWh']]

        df_cut = df_cut.merge(consumo_por_hora, how='left', left_on='Hora', right_index=True)

        l = llamada_API(df['Fecha'][0])

        fecha = df['Fecha'][0]
        consumo_total = (pd.to_numeric(df['Consumo_KWh'])).sum()
        
        csv_user = {'fecha': fecha, 'consumo_total': consumo_total}

        df_cut['Coste'] = l * df_cut['Consumo_KWh'].astype(float)

        json_data = df_cut.to_json(orient='records')

        return JsonResponse(json_data, safe=False, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


class UploadFileForm(forms.Form):
    file = forms.FileField()
