// PossessionForm.jsx
import React from 'react';

const PossessionForm = ({
  libelle,
  setLibelle,
  valeur,
  setValeur,
  dateDebut,
  setDateDebut,
  taux,
  setTaux,
  type,
  setType,
  handleSubmit
}) => (
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
);

export default PossessionForm;
