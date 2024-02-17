import '../css/houseInfoForm.css';
import {useState} from 'react';
import sendHouse from '../hooks/sendHouse';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


function HouseInfoForm() {
  const [zone, setZone] = useState('');
  const [csv, setCsv] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [chartData1, setChartData1] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  const [tipoGraf1, setTipoGraf1] = useState(true) //false: linea, true: barras
  const [tipoGraf2, setTipoGraf2] = useState(true) //false: linea, true: barras

  const processDataForChart = (data) => {

    console.log(data)
    const labels = (data.map(item => item.Hora)); //lista de horas
    console.log(labels)
    const values = data.map(item => parseFloat(item.Consumo_KWh)); //consumo en cada hora 
    const medias = data.map(item => parseFloat(item.Consumo)); 
    const precios = data.map(item => parseFloat(item.Coste)); 
    console.log(values)

    const grafConsumo =  {
      labels: labels,
      datasets: [
        {
          label: 'Consumo de Electricidad',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
          borderColor: 'rgb(75, 192, 192)', // Color del borde de las barras
          borderWidth: 2 // Ancho del borde de las barras
        }
      ]
    };

    const grafConsumoMedio =  {
      labels: labels,
      datasets: [
        {
          label: 'Consumo de Electricidad',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
          borderColor: 'rgb(75, 192, 192)', // Color del borde de las barras
          borderWidth: 2 // Ancho del borde de las barras
        },
        {
          label: 'Consumo medio',
          data: medias,
          backgroundColor: 'rgba(252, 33, 108, 0.2)', // Color de fondo de las barras
          borderColor: 'rgb(252, 33, 108)', // Color del borde de las barras
          borderWidth: 2 // Ancho del borde de las barras
        }
      ]
    };

    setChartData1(grafConsumo)
    setChartData2(grafConsumoMedio)

  };

  const handleHouseForm = async (e) => {
    e.preventDefault();
    try {
      const fields = await sendHouse(zone, csv);

      setRespondido(true);

      processDataForChart(JSON.parse(fields))

      console.log(chartData1)

      console.log("hola")
    } catch (err) {
      console.log("caracola")
    }
  }

  const handleCSVChange = (e) => {
    const file = e.target.files[0];
    if (file) {
     setCsv(file);
    }
  }

  const handleCSVDrop = (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
     setCsv(file);
     }
  }

  const handleTipoGraf = (numGraf) => {
    if (numGraf == 1) {
      if (tipoGraf1 == 0)
        setTipoGraf1(true)
      else
        setTipoGraf1(false)
    } else {
      if (tipoGraf2 == 0)
        setTipoGraf2(true)
      else
        setTipoGraf2(false)
    }
  }

  return (
    <div>

      {!respondido && <form className='form' id='houseForm' onSubmit={handleHouseForm}>
        <input type='text' placeholder='Insert your zone' className='zone' value={zone} onChange={e => setZone(e.target.value)} required/>
        <input className='text' id='dragNdrop' type='file' accept='.csv'
          onChange={handleCSVChange} onDrop={handleCSVDrop} onDragOver={(e) => e.preventDefault()}
          required/>
        <button className='sendButton' id='sendHouseButton'>ENVIAR CASA</button>
      </form>}

      {respondido && (
        <div className='contenedorGraficas'>
          <div className='grafica' id='grafica1'>
            <button className='botonChangeGraf' onClick={() => handleTipoGraf(1)}>Tipo gráfica</button>
            <h2>Consumo</h2>
            {tipoGraf1 && <Line data={chartData1} />}
            {!tipoGraf1 && <Bar data={chartData1} />}
          </div>
          <div className='grafica' id='grafica2'>
          <button className='botonChangeGraf' onClick={() => handleTipoGraf(2)}>Tipo gráfica</button>
            <h2>Consumo frente a media</h2>
            {tipoGraf2 && <Line data={chartData2} />}
            {!tipoGraf2 && <Bar data={chartData2} />}
          </div>
        </div>
      )}

    </div>
  );
};

export default HouseInfoForm;
