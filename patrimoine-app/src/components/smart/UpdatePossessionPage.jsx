  import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';

  const UpdatePossessionPage = () => {
    const { libelle } = useParams();
    const [newLibelle, setNewLibelle] = useState('');
    const [dateFin, setDateFin] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/possession`)
        .then(response => {
          const possession = response.data.find(p => p.libelle === libelle);
          if (possession) {
            setNewLibelle(possession.libelle || '');
            setDateFin(possession.dateFin || '');
          }
        })
        .catch(error => console.error('Error fetching possession:', error));
    }, [libelle]);

    const handleSubmit = (e) => {
      e.preventDefault();
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/possession/${libelle}`, { libelle: newLibelle, dateFin })
        .then(() => navigate('/possessions'))
        .catch(error => console.error('Error updating possession:', error));
    };

    return (
      <div className="container mt-4">
        <h1>Modifier la possession {libelle}</h1>
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
              value={dateFin || ''} // Assurez-vous que value est une chaîne vide si dateFin est null
              onChange={(e) => setDateFin(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Modifier</button>
        </form>
      </div>
    );
  };

  export default UpdatePossessionPage;