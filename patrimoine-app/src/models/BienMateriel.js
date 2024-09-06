import Possession from "./Possession.js";
export default class BienMateriel extends Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement);
  }

  getValeur(date) {
  console.log(`Calcul de la valeur pour ${this.libelle} à la date ${date}`);
  const valeur = super.getValeur(date);
  console.log(`Valeur calculée pour ${this.libelle}: ${valeur}`);
  return valeur;
  }
}