import React from 'react';
import { Card } from 'react-bootstrap';

const PatrimoineResult = ({ valeurPatrimoine }) => (
  <Card className="mt-4 shadow-sm">
    <Card.Body>
      <h5 className="text-center mb-3">Résultat</h5>
      <p className="text-center">Valeur du Patrimoine à la date de calcul: <strong>{valeurPatrimoine} EUR</strong></p>
    </Card.Body>
  </Card>
);

export default PatrimoineResult;
