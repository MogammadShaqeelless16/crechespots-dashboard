import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  const chartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [{
      data: [data.totalPresent, data.totalAbsent, data.totalLate],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
    }],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
