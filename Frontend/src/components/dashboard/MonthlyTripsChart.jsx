import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyTripsChart({ trips = [] }) {
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
        trips: 0
      });
    }

    trips.forEach(trip => {
      const dateField = trip.completionDate || trip.createdAt;
      if (!dateField) return;
      const date = new Date(dateField);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const match = data.find(item => item.monthKey === key);
      if (match) {
        match.trips += 1;
      }
    });

    return data;
  }, [trips]);

  return (
    <div className="premium-card p-4 h-100 d-flex flex-column" style={{ minHeight: '320px' }}>
      <h3 className="h6 fw-bold text-dark mb-4">Monthly Trips Volume</h3>
      
      <div className="flex-grow-1 w-100">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Bar
              dataKey="trips"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
