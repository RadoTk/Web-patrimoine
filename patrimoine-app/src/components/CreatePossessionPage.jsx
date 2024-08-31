import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePossessionPage = () => {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [taux, setTaux] = useState('');
  const [type, setType] = useState('BienMateriel'); // Assurez-vous que le type est correctement défini
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPossession = { 
      libelle, 
      valeur: parseFloat(valeur), 
      dateDebut, 
      tauxAmortissement: parseFloat(taux),
      type // Assurez-vous que le type est inclus
    };
    axios.post('http://localhost:5000/possession', newPossession)
      .then(() => navigate('/possessions'))
      .catch(error => console.error('Error creating possession:', error));
  };

  return (
    <div className="container mt-4">
  <div className="row justify-content-center">
    <div className="col-md-6 bg-light p-4 rounded">
      <h3 className="font-weight-bold text-center">Créer une nouvelle possession</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="font-weight-bold">Libelle</label>
          <input
            type="text"
            className="form-control"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="font-weight-bold">Valeur</label>
          <input
            type="number"
            className="form-control"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="font-weight-bold">Date Début</label>
          <input
            type="date"
            className="form-control"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="font-weight-bold">Taux Amortissement</label>
          <input
            type="number"
            className="form-control"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="font-weight-bold">Type</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="BienMateriel">Bien Materiel</option>
            <option value="Flux">Flux</option>
            <option value="Argent">Argent</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          Créer
        </button>
      </form>
    </div>
  </div>
</div>

  );
};

export default CreatePossessionPage;
