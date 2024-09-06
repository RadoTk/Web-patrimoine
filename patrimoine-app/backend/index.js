import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Conserve cette ligne
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());


const allowedOrigins = ['https://web-patrimoine.onrender.com']; // Mettez ici l'URL exacte du front déployé

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const patrimoine = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf8'));

let possessions = patrimoine.find(p => p.model === "Patrimoine").data.possessions;

import Personne from '../src/models/Personne.js';
import Patrimoine from '../src/models/Patrimoine.js';
import Flux from '../src/models/Flux.js';
import BienMateriel from '../src/models/BienMateriel.js';
import Argent from '../src/models/Argent.js';

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

  console.log(`Valeur totale du patrimoine calculée: ${valeurTotale}`);
  res.json({ valeurTotale });
});

app.post('/possession', (req, res) => {
  const newPossession = req.body;
  const currentDate = new Date();
  const johnDoe = new Personne(patrimoine[0].data.nom);
  let possessionInstance;

  switch (newPossession.type) {
    case 'Flux':
      possessionInstance = new Flux(johnDoe, newPossession.libelle, newPossession.valeur, new Date(newPossession.dateDebut), null, newPossession.tauxAmortissement, newPossession.jour, newPossession.valeurConstante);
      break;
    case 'Argent':
      possessionInstance = new Argent(johnDoe, newPossession.libelle, newPossession.valeur, new Date(newPossession.dateDebut), null, newPossession.tauxAmortissement, newPossession.type);
      break;
    default:
      possessionInstance = new BienMateriel(johnDoe, newPossession.libelle, newPossession.valeur, new Date(newPossession.dateDebut), null, newPossession.tauxAmortissement);
  }

  const valeurActuelle = possessionInstance.getValeur(currentDate);
  possessions.push({ ...newPossession, valeurActuelle });
  possessionInstances.push(possessionInstance);

  fs.writeFile('./data.json', JSON.stringify(patrimoine, null, 2), (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture dans le fichier data.json:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'ajout de la possession' });
    }
    res.status(201).json({ ...newPossession, valeurActuelle });
  });
});

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

    fs.writeFile('./data.json', JSON.stringify(patrimoine, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture dans le fichier data.json:', err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la possession' });
      }
      // Update the possessionInstances array
      const index = possessionInstances.findIndex(p => p.libelle === libelle);
      if (index !== -1) {
        possessionInstances[index].libelle = newLibelle;
        possessionInstances[index].dateFin = dateFin;
      }
      res.json(possession);
    });
  } else {
    res.status(404).json({ error: 'Possession non trouvée' });
  }
});

app.put('/possession/:libelle/close', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.dateFin = new Date().toISOString();

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
    possessionInstances.forEach(possession => {
      valeurTotale += possession.getValeur(currentDate);
    });

    evolution.push({
      date: currentDate.toISOString().split('T')[0],
      valeurTotale
    });

    incrementDate(currentDate);
  }

  res.json(evolution);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
