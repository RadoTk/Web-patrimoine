import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PossessionForm from '../dumb/PossessionForm';

const CreatePossessionPage = () => {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [taux, setTaux] = useState('');
  const [type, setType] = useState('BienMateriel');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPossession = { 
      libelle, 
      valeur: parseFloat(valeur), 
      dateDebut, 
      tauxAmortissement: parseFloat(taux),
      type 
    };
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/possession`, newPossession)
      .then(() => navigate('/possessions'))
      .catch(error => console.error('Error creating possession:', error));
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 bg-light p-4 rounded">
          <h3 className="font-weight-bold text-center">Créer une nouvelle possession</h3>
          <PossessionForm
            libelle={libelle}
            setLibelle={setLibelle}
            valeur={valeur}
            setValeur={setValeur}
            dateDebut={dateDebut}
            setDateDebut={setDateDebut}
            taux={taux}
            setTaux={setTaux}
            type={type}
            setType={setType}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePossessionPage;