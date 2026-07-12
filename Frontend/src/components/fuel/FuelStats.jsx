import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaGasPump, FaDollarSign, FaCalculator, FaChartBar } from 'react-icons/fa';

export default function FuelStats({ logs = [] }) {
  // Format numbers to USD currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const totalLiters = logs.reduce((sum, log) => sum + (log.quantity || 0), 0);
  const avgPrice = totalLiters > 0 ? totalCost / totalLiters : 0;

  // Prepare chart data (newest 8 fuel purchases, reversed to chronological order)
  const chartData = [...logs]
    .slice(0, 8)
    .reverse()
    .map(log => ({
      date: log.date ? new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A',
      cost: log.cost || 0,
      quantity: log.quantity || 0,
    }));

  const hasData = chartData.length > 0;

  const cardData = [
    {
      title: 'Total Fuel Expenses',
      value: formatCurrency(totalCost),
      icon: <FaDollarSign size={18} />,
      class: 'bg-primary text-white',
    },
    {
      title: 'Total Liters Refueled',
      value: `${totalLiters.toFixed(1)} L`,
      icon: <FaGasPump size={18} />,
      class: 'bg-white text-dark',
    },
    {
      title: 'Avg Price per Liter',
      value: `${formatCurrency(avgPrice)}/L`,
      icon: <FaCalculator size={18} />,
      class: 'bg-white text-dark',
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {/* Left side: KPI Cards List */}
      <div className="col-12 col-lg-5">
        <div className="d-flex flex-column gap-3 h-100 justify-content-between">
          {cardData.map((card, idx) => (
            <div
              key={idx}
              className={`premium-card p-4 border d-flex align-items-center justify-content-between flex-grow-1 ${card.class}`}
              style={{ borderRadius: '18px' }}
            >
              <div>
                <small className="opacity-75 d-block fw-semibold mb-1">{card.title}</small>
                <h3 className="fw-extrabold mb-0">{card.value}</h3>
              </div>
              <div
                className={`p-3 rounded-3 ${
                  card.class.includes('bg-primary') ? 'bg-white bg-opacity-25 text-white' : 'bg-light text-primary'
                }`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Recharts Bar Chart */}
      <div className="col-12 col-lg-7">
        <div className="premium-card bg-white p-4 h-100 d-flex flex-column justify-content-between">
          <div className="d-flex align-items-center gap-2 mb-3">
            <FaChartBar className="text-primary" />
            <div>
              <h6 className="fw-bold mb-0 text-dark">Refueling Log History</h6>
              <p className="text-secondary small mb-0">Cost breakdowns for your recent refuels.</p>
            </div>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ minHeight: '200px' }}>
            {hasData ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                  <Bar dataKey="cost" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4">
                <p className="text-secondary small mb-0">No refueling data logs captured.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
