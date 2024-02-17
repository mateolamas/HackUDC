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
csv_dia_1 = {'fecha' : '14/02/2023', 'consumo_total': 1.765 }
csv_dia_2 = {'fecha' : '13/02/2023', 'consumo_total': 1.433 }
csv_dia_3 = {'fecha' : '12/02/2023', 'consumo_total': 3.332 }
csv_dia_4 = {'fecha' : '11/02/2023', 'consumo_total': 2.566 }
csv_dia_5 = {'fecha' : '10/02/2023', 'consumo_total': 1.366 }
csv_dia_6 = {'fecha' : '09/02/2023', 'consumo_total': 3.066 }
csv_dia_7 = {'fecha' : '08/02/2023', 'consumo_total': 2.342 }

csv_mes_1 = {'fecha' : '02/2023', 'consumo_total': 1.865 }
csv_mes_2 = {'fecha' : '01/2023', 'consumo_total': 2.233 }
csv_mes_3 = {'fecha' : '12/2022', 'consumo_total': 1.332 }
csv_mes_4 = {'fecha' : '11/2022', 'consumo_total': 4.066 }
csv_mes_5 = {'fecha' : '10/2022', 'consumo_total': 2.166 }
csv_mes_6 = {'fecha' : '09/2022', 'consumo_total': 1.066 }
csv_mes_7 = {'fecha' : '08/2022', 'consumo_total': 3.342 }

csv_ano_1 = {'fecha' : '2023', 'consumo_total': 2.365 }
csv_ano_2 = {'fecha' : '2022', 'consumo_total': 4.233 }
csv_ano_3 = {'fecha' : '2021', 'consumo_total': 0.932 }
csv_ano_4 = {'fecha' : '2020', 'consumo_total': 1.266 }
csv_ano_5 = {'fecha' : '2019', 'consumo_total': 3.216 }
csv_ano_6 = {'fecha' : '2018', 'consumo_total': 0.366 }
csv_ano_7 = {'fecha' : '2017', 'consumo_total': 2.614 }

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
        param = request.GET.get('selected')

        if param == 'dia':
            lista_datos = [csv_user, csv_dia_1, csv_dia_2, csv_dia_3, csv_dia_4, csv_dia_5, csv_dia_6, csv_dia_7]
        elif param == 'mes':
            lista_datos = [csv_user, csv_mes_1, csv_mes_2, csv_mes_3, csv_mes_4, csv_mes_5, csv_mes_6, csv_mes_7]
        elif param == 'ano':
            lista_datos = [csv_user, csv_ano_1, csv_ano_2, csv_ano_3, csv_ano_4, csv_ano_5, csv_ano_6, csv_ano_7]
        

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
        df_cut['Precio'] = l

        json_data = df_cut.to_json(orient='records')

        return JsonResponse(json_data, safe=False, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


class UploadFileForm(forms.Form):
    file = forms.FileField()
