import '../css/houseInfoForm.css';
import {useState} from 'react';
import sendHouse from '../hooks/sendHouse';
import { Line, Bar } from 'react-chartjs-2';


function HouseInfoForm() {
  const [zone, setZone] = useState('');
  const [csv, setCsv] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [chartData, setChartData] = useState(null);

  const processDataForChart = (data) => {

    console.log(data)
    const labels = (data.map(item => item.Hora)); 
    console.log(labels)
    const values = data.map(item => parseInt(item.Consumo_KWh)); 
    console.log(values)

    return {
      labels: labels,
      datasets: [
        {
          label: 'Consumo de Electricidad',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
          borderColor: 'rgb(75, 192, 192)', // Color del borde de las barras
          borderWidth: 1 // Ancho del borde de las barras
        }
      ]
    };
  };

  const handleHouseForm = async (e) => {
    e.preventDefault();
    try {
      const fields = await sendHouse(zone, csv);

      setRespondido(true);

      setChartData(processDataForChart(JSON.parse(fields)));

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

  return (
    <div>

      {!respondido && <form className='form' id='houseForm' onSubmit={handleHouseForm}>
        <input type='text' placeholder='Insert your zone' className='zone' value={zone} onChange={e => setZone(e.target.value)} required/>
        <input className='text' id='dragNdrop' type='file' accept='.csv'
          onChange={handleCSVChange} onDrop={handleCSVDrop} onDragOver={(e) => e.preventDefault()}
          required/>
        <button className='sendButton' id='sendHouseButton'>ENVIAR CASA</button>
      </form>}

      {respondido && <div>
        <h2>Gráfico de Barras</h2>
        <Bar data={chartData} />
      </div>}

    </div>
  );
};

export default HouseInfoForm;