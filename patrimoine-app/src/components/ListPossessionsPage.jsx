import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BienMateriel from '../models/BienMateriel';
import Flux from '../models/Flux';
import Argent from '../models/Argent';
import 'react-datepicker/dist/react-datepicker.css';
import { Table, Button, Container, Row, Col, Alert } from 'react-bootstrap';

// Fonction pour créer une instance de la possession en fonction du type
const createPossessionInstance = (possession) => {
  switch (possession.type) {
    case 'BienMateriel':
      return new BienMateriel(
        possession.possesseur,
        possession.libelle,
        possession.valeur,
        new Date(possession.dateDebut),
        possession.dateFin ? new Date(possession.dateFin) : null,
        possession.tauxAmortissement
      );
    case 'Flux':
      return new Flux(
        possession.possesseur,
        possession.libelle,
        possession.valeur,
        new Date(possession.dateDebut),
        possession.dateFin ? new Date(possession.dateFin) : null,
        possession.tauxAmortissement,
        possession.jour,
        possession.valeurConstante
      );
    case 'Argent':
      return new Argent(
        possession.possesseur,
        possession.libelle,
        possession.valeur,
        new Date(possession.dateDebut),
        possession.dateFin ? new Date(possession.dateFin) : null,
        possession.tauxAmortissement,
        possession.type
      );
    default:
      return null;
  }
};

const ListPossessionsPage = () => {
  const [possessions, setPossessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/possession')
      .then(response => {
        const updatedPossessions = response.data.map(p => {
          const possessionInstance = createPossessionInstance(p);
          const valeurActuelle = possessionInstance ? possessionInstance.getValeur(selectedDate) : p.valeur;
          return {
            ...p,
            valeurActuelle: typeof valeurActuelle === 'number' ? valeurActuelle : 0
          };
        });
        setPossessions(updatedPossessions);
      })
      .catch(error => {
        console.error('Error fetching possessions:', error);
        setError('Erreur de chargement des possessions.');
      });
  }, [selectedDate]);

  const closePossession = (libelle) => {
    axios.put(`http://localhost:5000/possession/${libelle}/close`)
      .then(() => {
        setPossessions(possessions.map(p =>
          p.libelle === libelle ? { ...p, dateFin: new Date().toISOString() } : p
        ));
      })
      .catch(error => {
        console.error('Error closing possession:', error);
        setError('Erreur lors de la clôture de la possession.');
      });
  };

  return (
    <Container fluid className='pt-5'>
      <Row>
        <Col className="d-flex justify-content-between">
          <h3>Liste des possessions</h3>
          <Link to="/possessions/create">
            <Button variant="success">Créer une nouvelle possession</Button>
          </Link>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="table-container">
        <Table striped bordered hover responsive className="my-4 w-100">
          <thead className="table-dark text-white">
            <tr>
              <th>Libelle</th>
              <th>Valeur</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Taux</th>
              <th>Valeur Actuelle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {possessions.map((possession, index) => (
              <tr key={possession.libelle || index}>
                <td>{possession.libelle}</td>
                <td>{possession.valeur}</td>
                <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'En cours'}</td>
                <td>{possession.tauxAmortissement}</td>
                <td>{typeof possession.valeurActuelle === 'number' ? possession.valeurActuelle.toFixed(2) : 'N/A'}</td>
                <td className="d-flex">
                  <Link to={`/possessions/${possession.libelle}/update`} className="w-100 me-2">
                    <Button variant="primary" className="w-100">Modifier</Button>
                  </Link>
                  <Button variant="danger" className="w-100" onClick={() => closePossession(possession.libelle)}>
                    Clôturer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ListPossessionsPage;
