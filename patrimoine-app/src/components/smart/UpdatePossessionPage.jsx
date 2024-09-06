import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdatePossessionPage = () => {
  const { libelle } = useParams();
  const [newLibelle, setNewLibelle] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://web-patrimoine-backend.onrender.com/possession`)
      .then(response => {
        const possession = response.data.find(p => p.libelle === libelle);
        if (possession) {
          setNewLibelle(possession.libelle || '');
          setDateFin(possession.dateFin || '');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching possession:', error);
        setError('Erreur lors du chargement de la possession.');
        setLoading(false);
      });
  }, [libelle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://web-patrimoine-backend.onrender.com/possession/${libelle}`, { libelle: newLibelle, dateFin })
      .then(() => navigate('/possessions'))
      .catch(error => {
        console.error('Error updating possession:', error);
        setError('Erreur lors de la mise à jour de la possession.');
      });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Modifier la possession {libelle}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Libelle</label>
          <input 
            type="text" 
            className="form-control" 
            value={newLibelle}
            onChange={(e) => setNewLibelle(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Date Fin</label>
          <input 
            type="date" 
            className="form-control" 
            value={dateFin || ''}
            onChange={(e) => setDateFin(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Modifier</button>
      </form>
    </div>
  );
};

export default UpdatePossessionPage;
