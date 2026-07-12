import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ExpenseBreakdownChart({ stats = {} }) {
  const data = [
    { name: 'Fuel', value: stats.totalFuelCost || 0, color: '#F59E0B' },
    { name: 'Maintenance', value: stats.totalMaintenanceCost || 0, color: '#3B82F6' },
    { name: 'Toll', value: stats.totalTollCost || 0, color: '#10B981' },
    { name: 'Insurance', value: stats.totalInsuranceCost || 0, color: '#8B5CF6' },
    { name: 'Repair', value: stats.totalRepairCost || 0, color: '#EF4444' },
    { name: 'Other', value: stats.totalOtherExpenses || 0, color: '#64748B' }
  ].filter(d => d.value > 0);

  const chartData = data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#E2E8F0' }];

  return (
    <div className="premium-card p-4 h-100 d-flex flex-column" style={{ minHeight: '320px' }}>
      <h3 className="h6 fw-bold text-dark mb-4">Expense Breakdown</h3>
      
      <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value}`, 'Amount']}
              contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Grid */}
      <div className="row g-2 mt-3 px-2">
        {chartData.map((item) => (
          <div key={item.name} className="col-6 d-flex align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
            <span className="rounded-circle d-inline-block flex-shrink-0" style={{ width: '8px', height: '8px', backgroundColor: item.color }} />
            <span className="text-secondary text-truncate">{item.name}</span>
            {item.name !== 'No Data' && <span className="fw-semibold text-dark">${item.value}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
