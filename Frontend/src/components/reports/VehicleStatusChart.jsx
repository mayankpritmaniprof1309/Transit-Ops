import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10B981', '#2563EB', '#F59E0B', '#EF4444'];

export default function VehicleStatusChart({
  available = 0,
  onTrip = 0,
  inShop = 0,
  retired = 0,
}) {
  const data = [
    { name: 'Available', value: available },
    { name: 'On Trip', value: onTrip },
    { name: 'In Shop', value: inShop },
    { name: 'Retired', value: retired },
  ].filter(d => d.value > 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 185;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="fw-bold"
        style={{ fontSize: '0.75rem' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const total = available + onTrip + inShop + retired;

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Vehicle Status</h5>
      <p className="text-secondary small mb-4">Overall fleet availability and allocation distribution.</p>

      {total === 0 ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
          <p className="text-muted small">No vehicles data available</p>
        </div>
      ) : (
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={85}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}
                formatter={(value) => [`${value} Vehicles`, 'Status']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
