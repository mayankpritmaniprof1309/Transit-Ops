import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];

export default function FleetUtilizationCard({
  vehiclesOnTrip = 0,
  availableVehicles = 0,
  vehiclesInShop = 0,
  retiredVehicles = 0,
}) {
  const data = [
    { name: 'On Trip', value: vehiclesOnTrip },
    { name: 'Available', value: availableVehicles },
    { name: 'In Maintenance', value: vehiclesInShop },
    { name: 'Retired', value: retiredVehicles },
  ].filter(d => d.value > 0);

  const total = vehiclesOnTrip + availableVehicles + vehiclesInShop + retiredVehicles;
  const utilizationRate = total > 0 ? ((vehiclesOnTrip / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Fleet Utilization</h5>
      <p className="text-secondary small mb-4">Proportion of vehicles in service versus standby status.</p>

      {total === 0 ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
          <p className="text-muted small">No vehicles data available</p>
        </div>
      ) : (
        <div className="position-relative" style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}
                formatter={(value) => [`${value} Vehicles`, 'Count']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>

          {/* Absolute Center Indicator */}
          <div
            className="position-absolute start-50 top-50 translate-middle text-center"
            style={{ pointerEvents: 'none', marginTop: '-18px' }}
          >
            <span className="text-secondary small d-block">Utilization</span>
            <span className="fw-extrabold text-dark h3 mb-0">{utilizationRate}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
