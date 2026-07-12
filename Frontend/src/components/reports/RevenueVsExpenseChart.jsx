import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenueVsExpenseChart({ roiData = [] }) {
  // Format data for chart
  const chartData = roiData.map((item) => {
    const totalExpenses = (item.fuelCost || 0) + (item.maintenanceCost || 0) + (item.expenses || 0);
    return {
      name: item.registrationNumber || item.vehicleName || 'Unknown',
      Revenue: item.revenue || 0,
      Expenses: totalExpenses,
    };
  });

  const hasData = chartData.length > 0;

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Revenue vs. Expenses</h5>
      <p className="text-secondary small mb-4">Financial performance comparing expected trip revenue against direct operating costs per vehicle.</p>

      {!hasData ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '280px' }}>
          <p className="text-muted small">No ROI data available</p>
        </div>
      ) : (
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} formatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="Expenses"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
