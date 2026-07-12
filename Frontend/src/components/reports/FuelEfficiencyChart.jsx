import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FuelEfficiencyChart({ efficiencyData = [] }) {
  // Sort or prepare data
  const chartData = efficiencyData.map((item) => ({
    trip: item.tripNumber || 'Trip',
    Efficiency: item.fuelEfficiency || 0,
  }));

  const hasData = chartData.length > 0;

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Fuel Efficiency Trend</h5>
      <p className="text-secondary small mb-4">Distance traveled per unit of fuel (km/L) across logged trips.</p>

      {!hasData ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '280px' }}>
          <p className="text-muted small">No fuel efficiency data available</p>
        </div>
      ) : (
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="trip" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} label={{ value: 'km/L', angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}
                formatter={(value) => [`${value} km/L`, 'Fuel Efficiency']}
              />
              <Line
                type="monotone"
                dataKey="Efficiency"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
