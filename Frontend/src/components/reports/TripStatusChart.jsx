import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TripStatusChart({
  completed = 0,
  active = 0,
  pending = 0,
  cancelled = 0,
}) {
  const data = [
    {
      name: 'Trips Distribution',
      Completed: completed,
      Active: active,
      Pending: pending,
      Cancelled: cancelled,
    },
  ];

  const total = completed + active + pending + cancelled;

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Trip Status Breakdown</h5>
      <p className="text-secondary small mb-4">Stacked volume metrics summarizing workflow stages of all dispatch logs.</p>

      {total === 0 ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
          <p className="text-muted small">No trip status data available</p>
        </div>
      ) : (
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} hide />
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
              <Bar dataKey="Completed" stackId="a" fill="#10B981" barSize={32} radius={[4, 0, 0, 4]} />
              <Bar dataKey="Active" stackId="a" fill="#2563EB" barSize={32} />
              <Bar dataKey="Pending" stackId="a" fill="#F59E0B" barSize={32} />
              <Bar dataKey="Cancelled" stackId="a" fill="#EF4444" barSize={32} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
