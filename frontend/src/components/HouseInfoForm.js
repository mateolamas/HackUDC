import '../css/houseInfoForm.css';
import {useState} from 'react';
import controlDropHouse from '../hooks/controlDropHouse';
import sendHouse from '../hooks/sendHouse';

function HouseInfoForm() {
  const [zone, setZone] = useState('');
  const [csv, setCsv] = useState(null);

  const handleHouseForm = async (e) => {
    e.preventDefault();
    try {
      await sendHouse(zone, csv);
      console.log("hola")
      //setError(null);
    } catch (err) {
      console.log("hola")
      //setError(err.message);
    }
  }

  const handleCSVChange = (e) => {
    
  }

  const handleCSVDrop = (e) => {
    controlDropHouse(e, setCsv);
  }

  return (
    <div>
      <form className='form' id='houseForm' onSubmit={handleHouseForm}>
        <input type='text' placeholder='Insert your zone' className='zone' value={zone} onChange={e => setZone(e.target.value)} required/>
        <input className='text' id='dragNdrop' type='file' accept='.csv'
          onChange={handleCSVChange} onDrop={handleCSVDrop} onDragOver={(e) => e.preventDefault()}
          required/>
        <button className='sendButton' id='sendHouseButton'>ENVIAR CASA</button>
      </form>
    </div>
  );
};

export default HouseInfoForm;