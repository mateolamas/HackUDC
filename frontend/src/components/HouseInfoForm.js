import '../css/houseInfoForm.css';
import {useState} from 'react';
import sendHouse from '../hooks/sendHouse';
import { Line } from 'react-chartjs-2';

function HouseInfoForm() {
  const [zone, setZone] = useState('');
  const [csv, setCsv] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [chartData, setChartData] = useState(null);

  const handleHouseForm = async (e) => {
    e.preventDefault();
    try {
      const fields = await sendHouse(zone, csv);
      setRespondido = true;

      setChartData(processDataForChart(fields));

      console.log("hola")
    } catch (err) {
      console.log("caracola")
    }
  }

  const processDataForChart = (data) => {
    const labels = data.map(item => item.Hora);
    const values = data.map(item => item.Consumo); 

    return {
      labels: labels,
      datasets: [
        {
          label: 'Consumo de Electricidad',
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

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
        <Line data={chartData} />
      </div>}

    </div>
  );
};

export default HouseInfoForm;