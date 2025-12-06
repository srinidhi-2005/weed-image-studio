import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Metrics() {
  // Sample metrics data - replace with actual data from your model
  const fidData = [
    { epoch: 1, fid: 45.2 },
    { epoch: 5, fid: 38.7 },
    { epoch: 10, fid: 32.1 },
    { epoch: 15, fid: 28.5 },
    { epoch: 20, fid: 25.3 },
    { epoch: 25, fid: 23.1 },
    { epoch: 30, fid: 21.8 },
  ];

  const metricComparison = [
    { metric: 'FID Score', value: 21.8, benchmark: 25.0 },
    { metric: 'IS Score', value: 3.2, benchmark: 2.8 },
    { metric: 'LPIPS', value: 0.15, benchmark: 0.20 },
  ];

  const trainingMetrics = [
    { epoch: 1, loss: 2.5, val_loss: 2.8 },
    { epoch: 5, loss: 1.8, val_loss: 2.1 },
    { epoch: 10, loss: 1.3, val_loss: 1.6 },
    { epoch: 15, loss: 0.9, val_loss: 1.2 },
    { epoch: 20, loss: 0.6, val_loss: 0.9 },
    { epoch: 25, loss: 0.4, val_loss: 0.7 },
    { epoch: 30, loss: 0.3, val_loss: 0.5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Model Metrics</h1>
        <p className="text-gray-600">Performance metrics and evaluation results</p>
      </div>

      {/* FID Score Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">FID Score Over Training</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={fidData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'FID Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fid" stroke="#22c55e" strokeWidth={2} name="FID Score" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Current FID Score:</strong> 21.8 (Lower is better)</p>
          <p className="mt-2">The Fréchet Inception Distance (FID) measures the quality and diversity of generated images. A lower score indicates better performance.</p>
        </div>
      </div>

      {/* Metrics Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Metrics Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#22c55e" name="Our Model" />
            <Bar dataKey="benchmark" fill="#94a3b8" name="Benchmark" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Training Loss */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Training & Validation Loss</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trainingMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="loss" stroke="#22c55e" strokeWidth={2} name="Training Loss" />
            <Line type="monotone" dataKey="val_loss" stroke="#3b82f6" strokeWidth={2} name="Validation Loss" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">FID Score</h3>
          <p className="text-3xl font-bold text-primary-600">21.8</p>
          <p className="text-sm text-gray-600 mt-2">Lower is better</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">IS Score</h3>
          <p className="text-3xl font-bold text-primary-600">3.2</p>
          <p className="text-sm text-gray-600 mt-2">Higher is better</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">LPIPS</h3>
          <p className="text-3xl font-bold text-primary-600">0.15</p>
          <p className="text-sm text-gray-600 mt-2">Lower is better</p>
        </div>
      </div>
    </div>
  );
}

export default Metrics;

