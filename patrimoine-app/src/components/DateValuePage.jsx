import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateValuePage = () => {
  const [date, setDate] = useState(new Date());
  const [valeur, setValeur] = useState(null);

  const handleValidateDate = () => {
    axios.get(`http://localhost:5000/patrimoine/${date.toISOString()}`)
      .then(response => setValeur(response.data.totalValue))
      .catch(error => console.error('Error fetching patrimoine value:', error));
  };

  return (
    <div>
      <h3>Valeur Patrimoine à une Date Spécifique</h3>
      <DatePicker selected={date} onChange={date => setDate(date)} />
      <button onClick={handleValidateDate}>Valider</button>

      {valeur !== null && <p>Valeur du patrimoine : {valeur}</p>}
    </div>
  );
};

export default DateValuePage;
