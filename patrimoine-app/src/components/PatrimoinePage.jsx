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

  const handleJourChange = (event) => {
    setJour(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCalculate = async () => {
    if (!dateDebut || !dateFin) {
      setError('Veuillez sélectionner les deux dates.');
      return;
    }
  
    try {
      const labels = [];
      const data = [];
  
      let currentDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
  
      const uniqueDates = new Set();
  
      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        
        if (!uniqueDates.has(formattedDate)) {
          uniqueDates.add(formattedDate);
          
          const response = await axios.post(`http://localhost:5000/patrimoine/evolution`, {
            dateDebut: formattedDate,
            dateFin: endDate.toISOString().split('T')[0],
            type,
            jour
          });
  
          if (response.data && Array.isArray(response.data)) {
            response.data.forEach(item => {
              if (!labels.includes(item.date)) {
                labels.push(item.date);
                data.push(item.valeurTotale);
              }
            });
          } else {
            throw new Error('Réponse invalide du serveur');
          }
        }
  
        if (type === 'month') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
        }
      }
  
      setDataChart({
        labels,
        datasets: [{
          label: 'Valeur du Patrimoine',
          data,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
        }]
      });
  
      setValeurPatrimoine(data[data.length - 1]);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération de la valeur du patrimoine', error);
      setError('Erreur lors du calcul de la valeur du patrimoine.');
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

          {valeurPatrimoine && (
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <h5 className="text-center mb-3">Résultat</h5>
                <p className="text-center">Valeur du Patrimoine: <strong>{valeurPatrimoine} EUR</strong></p>
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