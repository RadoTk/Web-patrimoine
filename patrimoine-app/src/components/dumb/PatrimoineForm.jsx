import React from 'react';
import { Form, Card } from 'react-bootstrap';
import DatePickerField from './DatePickerField';
import SelectField from './SelectField';
import SubmitButton from './SubmitButton';

const PatrimoineForm = ({ 
  dateDebut, 
  dateFin, 
  dateCalcul, 
  jour, 
  type, 
  handleDateDebutChange, 
  handleDateFinChange, 
  handleDateCalculChange, 
  handleJourChange, 
  handleTypeChange, 
  handleCalculate 
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h3 className="text-center mb-4">Calcul du Patrimoine</h3>
        <Form>
          <DatePickerField
            label="Date de Début"
            selected={dateDebut}
            onChange={handleDateDebutChange}
            placeholderText="Sélectionner une date de début"
          />
          <DatePickerField
            label="Date de Fin"
            selected={dateFin}
            onChange={handleDateFinChange}
            placeholderText="Sélectionner une date de fin"
          />
          <DatePickerField
            label="Date de Calcul"
            selected={dateCalcul}
            onChange={handleDateCalculChange}
            placeholderText="Sélectionner une date de calcul"
          />
          <SelectField
            label="Jour"
            value={jour}
            onChange={handleJourChange}
            options={[
              { value: "01", label: "1er" },
              { value: "15", label: "15" }
            ]}
          />
          <SelectField
            label="Type"
            value={type}
            onChange={handleTypeChange}
            options={[
              { value: "month", label: "Mois" }
            ]}
          />
          <SubmitButton onClick={handleCalculate} label="Calculer" />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PatrimoineForm;
