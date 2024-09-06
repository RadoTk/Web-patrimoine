import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const PatrimoinePage = () => {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [dateCalcul, setDateCalcul] = useState(null);
  const [jour, setJour] = useState('01');
  const [valeurPatrimoine, setValeurPatrimoine] = useState(null);
  const [error, setError] = useState('');
  const [dataChart, setDataChart] = useState({ labels: [], datasets: [] });
  const [type, setType] = useState('month');

  const handleDateDebutChange = (date) => {
    setDateDebut(date);
  };

  const handleDateFinChange = (date) => {
    setDateFin(date);
  };

  const handleDateCalculChange = (date) => {
    setDateCalcul(date);
  };

  const handleJourChange = (event) => {
    setJour(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCalculate = async () => {
    if (!dateDebut || !dateFin || !dateCalcul) {
      setError('Veuillez sélectionner toutes les dates.');
      return;
    }

    try {
      // Calculer la valeur du patrimoine à la date de calcul
      const responseValeur = await axios.get(`https://web-patrimoine-backend.onrender.com/patrimoine/${dateCalcul.toISOString().split('T')[0]}`);

      if (responseValeur.data && typeof responseValeur.data.valeurTotale === 'number') {
        setValeurPatrimoine(responseValeur.data.valeurTotale);
      } else {
        throw new Error('Réponse invalide du serveur');
      }

      // Calculer l'évolution du patrimoine entre dateDebut et dateFin
      const responseEvolution = await axios.post(`https://web-patrimoine-backend.onrender.com/patrimoine/evolution`, {
        dateDebut: dateDebut.toISOString().split('T')[0],
        dateFin: dateFin.toISOString().split('T')[0],
        type,
        jour
      });

      if (responseEvolution.data && Array.isArray(responseEvolution.data)) {
        const labels = responseEvolution.data.map(item => item.date);
        const data = responseEvolution.data.map(item => item.valeurTotale);

        setDataChart({
          labels,
          datasets: [{
            label: 'Valeur du Patrimoine',
            data,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          }]
        });
      } else {
        throw new Error('Réponse invalide du serveur');
      }

      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération des données du patrimoine', error);
      setError('Erreur lors du calcul du patrimoine.');
    }
  };

  return (
    <Container fluid className="py-5 bg-light">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">Calcul du Patrimoine</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Date de Début</Form.Label>
                  <DatePicker
                    selected={dateDebut}
                    onChange={handleDateDebutChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Sélectionner une date de début"
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date de Fin</Form.Label>
                  <DatePicker
                    selected={dateFin}
                    onChange={handleDateFinChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Sélectionner une date de fin"
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date de Calcul</Form.Label>
                  <DatePicker
                    selected={dateCalcul}
                    onChange={handleDateCalculChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Sélectionner une date de calcul"
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Jour</Form.Label>
                  <Form.Select value={jour} onChange={handleJourChange}>
                    <option value="01">1er</option>
                    <option value="15">15</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select value={type} onChange={handleTypeChange}>
                    <option value="month">Mois</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" onClick={handleCalculate}>Calculer</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          {valeurPatrimoine !== null && (
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <h5 className="text-center mb-3">Résultat</h5>
                <p className="text-center">Valeur du Patrimoine à la date de calcul: <strong>{valeurPatrimoine} Ar</strong></p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {dataChart.labels.length > 0 && (
        <Row className="justify-content-center mt-5">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="text-center mb-4">Évolution du Patrimoine</h5>
                <Line
                  data={dataChart}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Valeur: ${context.raw} EUR`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: { display: true, text: 'Date' },
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10
                        }
                      },
                      y: { title: { display: true, text: 'Valeur (EUR)' } }
                    }
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PatrimoinePage;
