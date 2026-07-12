import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#D97706', '#3B82F6', '#EF4444'];

export default function ExpenseBreakdownChart({ costData = [] }) {
  // Sum up expense categories
  let totalFuel = 0;
  let totalMaintenance = 0;
  let totalOther = 0;

  costData.forEach((item) => {
    totalFuel += item.fuelCost || 0;
    totalMaintenance += item.maintenanceCost || 0;
    totalOther += item.otherExpenses || 0;
  });

  const total = totalFuel + totalMaintenance + totalOther;

  const data = [
    { name: 'Fuel Cost', value: totalFuel },
    { name: 'Maintenance Cost', value: totalMaintenance },
    { name: 'Other Expenses', value: totalOther },
  ].filter(d => d.value > 0);

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Expense Breakdown</h5>
      <p className="text-secondary small mb-4">Category allocation of operational expenses across the fleet.</p>

      {total === 0 ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
          <p className="text-muted small">No operational expense data available</p>
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
                formatter={(value) => [`$${value.toLocaleString()}`, 'Total Spent']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>

          <div
            className="position-absolute start-50 top-50 translate-middle text-center"
            style={{ pointerEvents: 'none', marginTop: '-18px' }}
          >
            <span className="text-secondary small d-block">Total Cost</span>
            <span className="fw-extrabold text-dark h4 mb-0">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      )}
    </div>
  );
}
