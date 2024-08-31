const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(bodyParser.json());

let patrimoine = require('./data.json');  // Assurez-vous que data.json est bien au bon emplacement
let possessions = patrimoine.find(p => p.model === "Patrimoine").data.possessions;

// Fonction pour calculer la valeur actuelle d'une possession
const calculateValeurActuelle = (possession, date) => {
  const now = date || new Date();
  switch (possession.type) {
    case 'BienMateriel':
      return calculateValeurBienMateriel(possession, now);
    case 'Flux':
      return calculateValeurFlux(possession, now);
    case 'Argent':
      return possession.valeur; // Valeur actuelle pour Argent est sa valeur initiale
    default:
      return 0;
  }
};

const calculateValeurBienMateriel = (possession, date) => {
  const dateDebut = new Date(possession.dateDebut);
  const tauxAmortissement = possession.tauxAmortissement || 0;
  if (date < dateDebut) return possession.valeur;
  const differenceDate = (date - dateDebut) / (1000 * 60 * 60 * 24 * 365); // En années
  return possession.valeur - (possession.valeur * (differenceDate * tauxAmortissement / 100));
};

const calculateValeurFlux = (possession, date) => {
  const nombreDeMois = (debut, dateEvaluation, jourJ) => {
    let compteur = 0;
    if (debut.getDate() < jourJ) {
      compteur++;
    }
    if (dateEvaluation.getDate() >= jourJ &&
        !(debut.getFullYear() === dateEvaluation.getFullYear() &&
        debut.getMonth() === dateEvaluation.getMonth())) {
      compteur++;
    }
    let totalMois = (dateEvaluation.getFullYear() - debut.getFullYear()) * 12 +
                     (dateEvaluation.getMonth() - debut.getMonth()) - 1;
    compteur += Math.max(0, totalMois);
    return compteur;
  };
  return possession.valeurConstante * nombreDeMois(new Date(possession.dateDebut), date, possession.jour);
};

// Route pour obtenir toutes les possessions
app.get('/possession', (req, res) => {
  res.json(possessions);
});

// Route pour ajouter une nouvelle possession
app.post('/possession', (req, res) => {
  const newPossession = req.body;
  const valeurActuelle = calculateValeurActuelle(newPossession, new Date());
  possessions.push({ ...newPossession, valeurActuelle });
  
  // Mettre à jour le fichier data.json
  fs.writeFile('./data.json', JSON.stringify(patrimoine, null, 2), (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture dans le fichier data.json:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'ajout de la possession' });
    }
    res.status(201).json({ ...newPossession, valeurActuelle });
  });
});

// Route pour mettre à jour la date de fin d'une possession
app.put('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const { dateFin } = req.body;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.dateFin = dateFin;

    // Mettre à jour le fichier data.json
    fs.writeFile('./data.json', JSON.stringify(patrimoine, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture dans le fichier data.json:', err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la possession' });
      }
      res.json(possession);
    });
  } else {
    res.status(404).json({ error: 'Possession non trouvée' });
  }
});

// Route pour clôturer une possession (date de fin = date actuelle)
app.put('/possession/:libelle/close', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.dateFin = new Date().toISOString();

    // Mettre à jour le fichier data.json
    fs.writeFile('./data.json', JSON.stringify(patrimoine, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture dans le fichier data.json:', err);
        return res.status(500).json({ error: 'Erreur lors de la clôture de la possession' });
      }
      res.json(possession);
    });
  } else {
    res.status(404).json({ error: 'Possession non trouvée' });
  }
});

// Route pour obtenir la valeur totale du patrimoine à une date spécifique
app.get('/patrimoine/:date', (req, res) => {
  const { date } = req.params;
  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({ error: 'Date invalide' });
  }

  const valeurTotale = possessions.reduce((total, possession) => {
    return total + calculateValeurActuelle(possession, selectedDate);
  }, 0);

  res.json({ valeurTotale });
});

app.post('/patrimoine/evolution', (req, res) => {
  const { dateDebut, dateFin, type, jour } = req.body;

  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);

  if (isNaN(debut.getTime()) || isNaN(fin.getTime()) || !type || !jour) {
    return res.status(400).json({ error: 'Paramètres invalides' });
  }

  const evolution = [];
  let currentDate = new Date(debut);

  const incrementDate = type === 'annuel' 
    ? date => date.setFullYear(date.getFullYear() + 1)
    : date => date.setMonth(date.getMonth() + 1);

  const totalPossessions = possessions.length;

  while (currentDate <= fin) {
    let valeurTotale = 0;
    for (let i = 0; i < totalPossessions; i++) {
      valeurTotale += calculateValeurActuelle(possessions[i], currentDate);
    }
    
    evolution.push({
      date: currentDate.toISOString().split('T')[0],
      valeurTotale
    });

    incrementDate(currentDate);
  }

  res.json(evolution);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
