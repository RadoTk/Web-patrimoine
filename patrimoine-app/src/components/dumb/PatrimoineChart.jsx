import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';

const PatrimoineChart = ({ dataChart }) => (
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
);

export default PatrimoineChart;
