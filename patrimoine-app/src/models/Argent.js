import Possession from "./Possession.js";

export const TYPE_ARGENT = {
  Courant: "Courant",
  Epargne: "Epargne",
  Espece: "Espece"
};

export default class Argent extends Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement, type) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement);
    try {
      // Ajout du contrôle pour le type
      if (!Object.values(TYPE_ARGENT).includes(type)) {
        throw new Error("Type d'argent invalide");
      }
      this.type = type;
    } catch (e) {
      console.error(e);
    }
  }
}