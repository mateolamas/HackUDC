import '../css/houseInfoForm.css';
import {useState} from 'react';
import {sendHouse, showPastData } from '../hooks/sendHouse';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import TableComponent from '../hooks/tableComponent';
import logo from '../img/home.jpg'


function HouseInfoForm() {
  const [zone, setZone] = useState('');
  const [csv, setCsv] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [pastData, setPastData] = useState(false);
  const [dataInfo, setDataInfo] = useState(null)
  const [chartData1, setChartData1] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  const [chartData3, setChartData3] = useState(null);
  const [tipoGraf1, setTipoGraf1] = useState(true) //false: linea, true: barras
  const [tipoGraf2, setTipoGraf2] = useState(true) //false: linea, true: barras
  const [tipoGraf3, setTipoGraf3] = useState(true) //false: linea, true: barras

  const processDataForChart = (data) => {

    console.log(data)
    const labels = (data.map(item => item.Hora)); //lista de horas
    console.log(labels)
    const values = data.map(item => parseFloat(item.Consumo_KWh)); //consumo en cada hora 
    const medias = data.map(item => parseFloat(item.Consumo)); 
    const costes = data.map(item => parseFloat(item.Coste)); 
    const precios = data.map(item => parseFloat(item.Precio)); 
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
        },
        {
          label: 'Precio de electricidad',
          data: precios,
          backgroundColor: 'rgba(55, 140, 246, 0.2)', // Color de fondo de las barras
          borderColor: 'rgb(55, 140, 246)', // Color del borde de las barras
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

    const grafCoste =  {
      labels: labels,
      datasets: [
        {
          label: 'Coste de Electricidad',
          data: costes,
          backgroundColor: 'rgba(252, 217, 33 , 0.2)', // Color de fondo de las barras
          borderColor: 'rgb(252, 217, 33 )', // Color del borde de las barras
          borderWidth: 2 // Ancho del borde de las barras
        }
      ]
    };

    setChartData1(grafConsumo)
    setChartData2(grafConsumoMedio)
    setChartData3(grafCoste)

  };

  const processDataForTable = (data) => {

    console.log(data)
    const labels = (data.map(item => item.Fecha)); //lista de horas
    console.log(labels)
    const values = data.map(item => parseFloat(item.Consumo_KWh)); //consumo en cada hora 
    console.log(values)

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
    } else if (numGraf == 2) {
      if (tipoGraf2 == 0)
        setTipoGraf2(true)
      else
        setTipoGraf2(false)
    } else if (numGraf == 3) {
      if (tipoGraf3 == 0)
        setTipoGraf3(true)
      else
        setTipoGraf3(false)
    }
  }

  const handlePastData = async (e) => {
    e.preventDefault();
    try {
      const selectedValue = e.target.elements.dates.value;
      const fields = await showPastData(selectedValue);
      console.log(fields)

      setPastData(true);
      setDataInfo(fields);

      //processDataForTable(JSON.parse(fields))

      console.log("hola")
    } catch (err) {
      console.log("caracola")
    }
  }

  return (
    <div>

      {!respondido && <form className='form' id='houseForm' onSubmit={handleHouseForm}>
        <h2 id='titulo'>Inserta el csv de tu factura de la luz</h2>
        <input className='text' id='dragNdrop' type='file' accept='.csv'
          onChange={handleCSVChange} onDrop={handleCSVDrop} onDragOver={(e) => e.preventDefault()}
          required/>
        <button className='sendButton' id='sendHouseButton'>ENVIAR</button>
      </form>}

      {respondido && <img onClick={() => setRespondido(false)} className='logo' id='logoBack' src={logo} alt='Logo de la compañia' />}

      {respondido && (
        <div className='contenedorGraficas'>
          <div className='grafica' id='grafica1'>
            <button className='botonChangeGraf' onClick={() => handleTipoGraf(1)}>Cambiar gráfica</button>
            <h2>Consumo/hora</h2>
            {tipoGraf1 && <Line data={chartData1} />}
            {!tipoGraf1 && <Bar data={chartData1} />}
          </div>
          <div className='grafica' id='grafica2'>
          <button className='botonChangeGraf' onClick={() => handleTipoGraf(2)}>Cambiar gráfica</button>
            <h2>Consumo frente a media</h2>
            {tipoGraf2 && <Line data={chartData2} />}
            {!tipoGraf2 && <Bar data={chartData2} />}
          </div>
          <div className='grafica' id='grafica3'>
            <button className='botonChangeGraf' onClick={() => handleTipoGraf(3)}>Cambiar gráfica</button>
            <h2>Coste en €/hora</h2>
            {tipoGraf3 && <Line data={chartData3} />}
            {!tipoGraf3 && <Bar data={chartData3} />}
          </div>
          {pastData && <div id='tabla'>
            <TableComponent data={dataInfo}/>
            <form action="#" onSubmit={handlePastData}>
                <label for="dates">Comparar por </label>
                  <select name="dates" id="dates" className="select-box">
                    <option value="dia">Días</option>
                    <option value="mes">Meses</option>
                    <option value="ano">Años</option>
                  </select>
                  <input type="submit" value="Enviar" className="submit-button"/>
            </form>
            </div>}
          {!pastData && <div className='grafica' id='grafica4'>
            <h2>Datos pasados</h2>
            <form action="#" onSubmit={handlePastData}>
                <label for="dates">Comparar por </label>
                  <select name="dates" id="dates" className="select-box">
                    <option value="dia">Días</option>
                    <option value="mes">Meses</option>
                    <option value="ano">Años</option>
                  </select>
                  <input type="submit" value="Enviar" className="submit-button"/>
            </form>
          </div>}
        </div>
      )}

    </div>
  );
};

export default HouseInfoForm;
