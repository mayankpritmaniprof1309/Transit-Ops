import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FuelTrendChart({ fuelLogs = [] }) {
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const data = [];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        monthKey: `${d.getFullYear()}-${d.getMonth()}`,
        name: `${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
        cost: 0
      });
    }

    fuelLogs.forEach(log => {
      if (!log.fuelDate) return;
      const date = new Date(log.fuelDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const match = data.find(item => item.monthKey === key);
      if (match) {
        match.cost += (log.fuelCost || 0);
      }
    });

    return data;
  }, [fuelLogs]);

  return (
    <div className="premium-card p-4 h-100 d-flex flex-column" style={{ minHeight: '320px' }}>
      <h3 className="h6 fw-bold text-dark mb-4">Fuel Expenditures Trend</h3>
      
      <div className="flex-grow-1 w-100">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 23, 42, 0.05)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, 'Cost']}
              contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--warning)' }}
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="var(--warning)"
              strokeWidth={3}
              dot={{ stroke: 'var(--warning)', strokeWidth: 2, r: 4, fill: '#FFFFFF' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
