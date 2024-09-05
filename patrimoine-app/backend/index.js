import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());

const patrimoine = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const possessions = patrimoine.find(p => p.model === "Patrimoine").data.possessions;

// Import the necessary classes
import Personne from '../src/models/Personne.js';
import Patrimoine from '../src/models/Patrimoine.js';
import Possession from '../src/models/Possession.js';
import Flux from '../src/models/Flux.js';
import BienMateriel from '../src/models/BienMateriel.js';
import Argent from '../src/models/Argent.js';
// Create instances of possessions
const createPossessions = () => {
  const johnDoe = new Personne(patrimoine[0].data.nom);
  return possessions.map(item => {
    const dateDebut = new Date(item.dateDebut);
    const dateFin = item.dateFin ? new Date(item.dateFin) : null;

    if (item.jour !== undefined && item.valeurConstante !== undefined) {
      return new Flux(johnDoe, item.libelle, item.valeur, dateDebut, dateFin, item.tauxAmortissement, item.jour, item.valeurConstante);
    } else if (item.libelle === "Compte épargne") {
      return new Argent(johnDoe, item.libelle, item.valeur, dateDebut, dateFin, item.tauxAmortissement, "Epargne");
    } else {
      return new BienMateriel(johnDoe, item.libelle, item.valeur, dateDebut, dateFin, item.tauxAmortissement);
    }
  });
};

const possessionInstances = createPossessions();

// Modify the existing routes to use the new calculation methods

app.get('/possession', (req, res) => {
  const currentDate = new Date();
  const possessionsWithCurrentValue = possessionInstances.map(p => ({
    ...p,
    valeurActuelle: p.getValeur(currentDate)
  }));
  res.json(possessionsWithCurrentValue);
});

app.get('/patrimoine/:date', (req, res) => {
  const { date } = req.params;
  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({ error: 'Date invalide' });
  }

  const johnDoe = new Personne(patrimoine[0].data.nom);
  const patrimoineInstance = new Patrimoine(johnDoe, possessionInstances);
  const valeurTotale = patrimoineInstance.getValeur(selectedDate);

  res.json({ valeurTotale });
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
  const { libelle: newLibelle, dateFin } = req.body;

  const possession = possessions.find(p => p.libelle === libelle);

  if (possession) {
    if (newLibelle) {
      possession.libelle = newLibelle;
    }
    if (dateFin) {
      possession.dateFin = dateFin;
    }

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

  while (currentDate <= fin) {
    let valeurTotale = 0;
    possessions.forEach(possession => {
      valeurTotale += calculateValeurActuelle(possession, currentDate);
    });

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
