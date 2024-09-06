import React from 'react';
import { Table } from 'react-bootstrap';
import PossessionRow from './PossessionRow';

const PossessionTable = ({ possessions, onClose }) => {
  return (
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
          <PossessionRow key={possession.libelle || index} possession={possession} onClose={onClose} />
        ))}
      </tbody>
    </Table>
  );
};

export default PossessionTable;
