import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyTrendChart({ trips = [] }) {
  // Group trips by month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyCounts = {};
  // Initialize last 6 months with 0 to ensure chart looks good even with sparse data
  const currentMonthIdx = new Date().getMonth();
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    monthlyCounts[monthNames[idx]] = 0;
  }

  trips.forEach((trip) => {
    if (trip.createdAt) {
      const date = new Date(trip.createdAt);
      if (!isNaN(date)) {
        const monthName = monthNames[date.getMonth()];
        if (monthlyCounts[monthName] !== undefined) {
          monthlyCounts[monthName] += 1;
        } else {
          // If date is outside the initialized range, we can still record it
          monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
        }
      }
    }
  });

  const chartData = Object.keys(monthlyCounts).map((key) => ({
    Month: key,
    Trips: monthlyCounts[key],
  }));

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <h5 className="fw-bold text-dark mb-1">Monthly Dispatch Trend</h5>
      <p className="text-secondary small mb-4">Total number of dispatched cargo trips recorded per month.</p>

      <div style={{ height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="Month" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}
              formatter={(value) => [`${value} Trips`, 'Trips Dispatched']}
            />
            <Area
              type="monotone"
              dataKey="Trips"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTrips)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
