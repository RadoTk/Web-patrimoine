export default class Patrimoine {
    constructor(possesseur, possessions) {
      this.possesseur = possesseur;
      this.possessions = [...possessions]; // [Possession, Possession, ...]
    }
    getValeur(date) {
      console.log(`Calcul de la valeur totale du patrimoine à la date ${date}`);
      let result = 0;
      for (const item of this.possessions) {
        const valeurItem = item.getValeur(date);
        console.log(`Valeur de ${item.libelle}: ${valeurItem}`);
        result += valeurItem;
      }
      console.log(`Valeur totale du patrimoine: ${result}`);
      return result;
    }
    addPossession(possession) {
      if (possession.possesseur != this.possesseur) {
        console.log(
          `${possession.libelle} n'appartient pas à ${this.possesseur}`,
        );
      } else {
        this.possessions.push(possession);
      }
    }
    removePossession(possession) {
      this.possessions = this.possessions.filter(
        (p) => p.libelle !== possession.libelle,
      );
    }
  }
