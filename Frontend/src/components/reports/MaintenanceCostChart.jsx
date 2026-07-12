import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'];

export default function MaintenanceCostChart({ costData = [] }) {
  // Map data for chart
  const chartData = costData.map((item) => ({
    name: item.registrationNumber || item.vehicleName || 'Unknown',
    Cost: item.maintenanceCost || 0,
  }));

  const hasData = chartData.length > 0;

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Maintenance Cost Analysis</h5>
      <p className="text-secondary small mb-4">Total accumulative maintenance and repair expenses per fleet vehicle.</p>

      {!hasData ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '280px' }}>
          <p className="text-muted small">No maintenance cost data available</p>
        </div>
      ) : (
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} formatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Maintenance Cost']}
              />
              <Bar dataKey="Cost" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
