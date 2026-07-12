import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function VehicleStatusChart({ available = 0, onTrip = 0, inShop = 0 }) {
  const data = [
    { name: 'Available', value: available, color: '#10B981' },
    { name: 'On Trip', value: onTrip, color: '#3B82F6' },
    { name: 'In Shop', value: inShop, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // Fallback if all values are 0
  const chartData = data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#E2E8F0' }];

  return (
    <div className="premium-card p-4 h-100 d-flex flex-column" style={{ minHeight: '320px' }}>
      <h3 className="h6 fw-bold text-dark mb-4">Vehicle Status Distribution</h3>
      
      <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text displaying Active percentage/count */}
        {data.length > 0 && (
          <div className="position-absolute text-center d-flex flex-column align-items-center" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
            <span className="h4 fw-bold text-dark m-0" style={{ letterSpacing: '-0.02em' }}>
              {available + onTrip + inShop}
            </span>
            <span className="text-secondary" style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Active
            </span>
          </div>
        )}
      </div>

      {/* Custom Legend */}
      <div className="d-flex justify-content-center gap-4 mt-3 flex-wrap">
        {chartData.map((item) => (
          <div key={item.name} className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
            <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', backgroundColor: item.color }} />
            <span className="text-secondary">{item.name}</span>
            {item.name !== 'No Data' && <span className="fw-semibold text-dark">({item.value})</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
