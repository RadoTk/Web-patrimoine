import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const PossessionRow = ({ possession, onClose }) => {
  return (
    <tr>
      <td>{possession.libelle}</td>
      <td>{possession.valeur.toFixed(2)}</td>
      <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
      <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'En cours'}</td>
      <td>{possession.tauxAmortissement}</td>
      <td>{possession.valeurActuelle ? possession.valeurActuelle.toFixed(2) : 'N/A'}</td>
      <td className="d-flex">
        <Link to={`/possessions/${possession.libelle}/update`} className="w-100 me-2">
          <Button variant="primary" className="w-100">Modifier</Button>
        </Link>
        <Button variant="danger" className="w-100" onClick={() => onClose(possession.libelle)}>
          Clôturer
        </Button>
      </td>
    </tr>
  );
};

export default PossessionRow;
