import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement);

function Reports() {
  const [countReport, setCountReport] = useState([]);
  const [statusReport, setStatusReport] = useState([]);
  const [priceReport, setPriceReport] = useState([]);
  const [imageUsage, setImageUsage] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/car-models/report/count')
      .then(res => setCountReport(res.data));
    axios.get('http://localhost:4000/api/car-models/report/status')
      .then(res => setStatusReport(res.data));
    axios.get('http://localhost:4000/api/car-models/report/price')
      .then(res => setPriceReport(res.data));
    axios.get('http://localhost:4000/api/car-models/report/images')
      .then(res => setImageUsage(res.data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Reports</h1>

      <h3>1. Active vs Inactive</h3>
      <Pie
        data={{
          labels: statusReport.map(s => (s._id ? 'Active' : 'Inactive')),
          datasets: [{
            data: statusReport.map(s => s.count),
            backgroundColor: ['#4caf50', '#f44336']
          }]
        }}
      />

      <h3>2. Average Price by Brand</h3>
      <Bar
        data={{
          labels: priceReport.map(p => p._id),
          datasets: [
            {
              label: 'Avg Price',
              data: priceReport.map(p => p.avgPrice),
              backgroundColor: '#2196f3'
            }
          ]
        }}
      />

      <h3>3. Image Usage</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Model Name</th>
            <th>Image Count</th>
            <th>Total Size</th>
          </tr>
        </thead>
        <tbody>
          {imageUsage.map((r, idx) => (
            <tr key={idx}>
              <td>{r.modelName}</td>
              <td>{r.count}</td>
              <td>{r.totalSize}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
