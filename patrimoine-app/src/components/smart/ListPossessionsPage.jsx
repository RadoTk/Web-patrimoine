import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BienMateriel from '../../models/BienMateriel';
import Flux from '../../models/Flux';
import Argent from '../../models/Argent';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import PossessionTable from '../dumb/PossessionTable';
import ErrorMessage from '../dumb/ErrorMessage';
import { useLocation } from 'react-router-dom';

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
  const [error, setError] = useState('');
  const location = useLocation();

  const fetchPossessions = () => {
    axios.get('https://web-patrimoine-backend.onrender.com/possession')
      .then(response => {
        setPossessions(response.data);
      })
      .catch(error => {
        console.error('Error fetching possessions:', error);
        setError('Erreur de chargement des possessions.');
      });
  };

  useEffect(() => {
    fetchPossessions();
  }, [location.state]);

  const closePossession = (libelle) => {
    axios.put(`https://web-patrimoine-backend.onrender.com/possession/${libelle}/close`)
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
      <ErrorMessage message={error} />
      <div className="table-container">
        <PossessionTable possessions={possessions} onClose={closePossession} />
      </div>
    </Container>
  );
};

export default ListPossessionsPage;
