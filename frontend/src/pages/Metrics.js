import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Metrics() {
  // TransDiff Base Model Training Loss (8 epochs)
  const transdiffBaseLoss = [
    { epoch: 1, loss: 0.99 },
    { epoch: 2, loss: 0.954 },
    { epoch: 3, loss: 0.944 },
    { epoch: 4, loss: 0.938 },
    { epoch: 5, loss: 0.932 },
    { epoch: 6, loss: 0.935 },
    { epoch: 7, loss: 0.936 },
    { epoch: 8, loss: 0.935 },
  ];

  // TransDiff with MRAR Model Training Loss (5 epochs)
  const transdiffMRARLoss = [
    { epoch: 1, loss: 2.61 },
    { epoch: 2, loss: 2.01 },
    { epoch: 3, loss: 1.88 },
    { epoch: 4, loss: 1.80 },
    { epoch: 5, loss: 1.74 },
  ];

  // Combined data for comparison chart
  const combinedLossData = [
    { epoch: 1, base: 0.99, mrar: 2.61 },
    { epoch: 2, base: 0.954, mrar: 2.01 },
    { epoch: 3, base: 0.944, mrar: 1.88 },
    { epoch: 4, base: 0.938, mrar: 1.80 },
    { epoch: 5, base: 0.932, mrar: 1.74 },
    { epoch: 6, base: 0.935, mrar: null },
    { epoch: 7, base: 0.936, mrar: null },
    { epoch: 8, base: 0.935, mrar: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Training <span className="gradient-text">Loss Curves</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Training performance metrics for TransDiff Base and MRAR models
          </p>
        </div>

        {/* Training Loss Comparison */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-primary-100/50 animate-fadeInUp">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Training Loss Comparison: TransDiff Base vs MRAR</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combinedLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Average Loss', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="base" stroke="#22c55e" strokeWidth={2} name="TransDiff Base" dot={{ r: 5 }} />
              <Line type="monotone" dataKey="mrar" stroke="#3b82f6" strokeWidth={2} name="TransDiff with MRAR" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p><strong>TransDiff Base:</strong> Loss decreased from 0.99 to 0.935 over 8 epochs (final loss: 0.935)</p>
            <p><strong>TransDiff with MRAR:</strong> Loss decreased from 2.61 to 1.74 over 5 epochs (final loss: 1.74)</p>
            <p className="mt-2 text-xs text-gray-500">Note: Lower loss values indicate better model performance during training.</p>
          </div>
        </div>

        {/* Individual Training Loss Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* TransDiff Base Model */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-primary-100/50 animate-fadeInUp">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">TransDiff Base Model</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={transdiffBaseLoss}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={[0.92, 1.0]} label={{ value: 'Average Loss', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="loss" stroke="#22c55e" strokeWidth={2} name="Training Loss" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Training Epochs:</strong> 8</p>
              <p><strong>Initial Loss:</strong> 0.99</p>
              <p><strong>Final Loss:</strong> 0.935</p>
              <p><strong>Improvement:</strong> 5.6% reduction</p>
            </div>
          </div>

          {/* TransDiff with MRAR Model */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-primary-100/50 animate-fadeInUp">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">TransDiff with MRAR</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={transdiffMRARLoss}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={[1.6, 2.7]} label={{ value: 'Average Loss', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="loss" stroke="#3b82f6" strokeWidth={2} name="Training Loss" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Training Epochs:</strong> 5</p>
              <p><strong>Initial Loss:</strong> 2.61</p>
              <p><strong>Final Loss:</strong> 1.74</p>
              <p><strong>Improvement:</strong> 33.3% reduction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;
