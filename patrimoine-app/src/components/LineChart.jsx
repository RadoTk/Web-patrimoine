// components/LineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const LineChart = ({ data }) => {
  const chartData = {
    labels: data.labels, // Dates ou labels pour l'axe X
    datasets: [
      {
        label: 'Valeur des Possessions',
        data: data.values, // Valeurs pour l'axe Y
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Valeur: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
