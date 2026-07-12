import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FaFileInvoiceDollar, FaGasPump, FaWrench, FaTools } from 'react-icons/fa';

export default function ExpenseStats({ stats }) {
  // Format numbers to USD currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const total = stats?.totalExpenses || 0;
  const fuel = stats?.totalFuelCost || 0;
  const maintenance = stats?.totalMaintenanceCost || 0;
  const repairs = stats?.totalRepairCost || 0;

  // Chart data
  const data = [
    { name: 'Fuel Costs', value: stats?.totalFuelCost || 0, color: '#3B82F6' },
    { name: 'Maintenance', value: stats?.totalMaintenanceCost || 0, color: '#F59E0B' },
    { name: 'Tolls', value: stats?.totalTollCost || 0, color: '#10B981' },
    { name: 'Insurance', value: stats?.totalInsuranceCost || 0, color: '#8B5CF6' },
    { name: 'Repairs', value: stats?.totalRepairCost || 0, color: '#EF4444' },
    { name: 'Other', value: stats?.totalOtherExpenses || 0, color: '#64748B' },
  ].filter(item => item.value > 0);

  // Fallback if no data is available
  const hasData = data.length > 0;

  const cardData = [
    {
      title: 'Total Operation Expenses',
      value: formatCurrency(total),
      icon: <FaFileInvoiceDollar size={20} />,
      class: 'bg-primary text-white',
      border: 'border-primary',
    },
    {
      title: 'Fuel Expenses',
      value: formatCurrency(fuel),
      icon: <FaGasPump size={20} />,
      class: 'bg-white text-dark',
      border: 'border-light',
    },
    {
      title: 'Maintenance Services',
      value: formatCurrency(maintenance),
      icon: <FaWrench size={20} />,
      class: 'bg-white text-dark',
      border: 'border-light',
    },
    {
      title: 'Fleet Repair Costs',
      value: formatCurrency(repairs),
      icon: <FaTools size={20} />,
      class: 'bg-white text-dark',
      border: 'border-light',
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {/* Left side: KPI Cards Grid */}
      <div className="col-12 col-lg-7">
        <div className="row g-3 h-100">
          {cardData.map((card, idx) => (
            <div key={idx} className="col-12 col-sm-6">
              <div
                className={`premium-card h-100 p-4 border d-flex flex-column justify-content-between ${card.class}`}
                style={{ borderRadius: '18px' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="small opacity-75 fw-semibold">{card.title}</span>
                  <div
                    className={`p-2.5 rounded-3 ${
                      card.class.includes('bg-primary') ? 'bg-white bg-opacity-20 text-white' : 'bg-light text-primary'
                    }`}
                  >
                    {card.icon}
                  </div>
                </div>
                <div>
                  <h3 className="fw-extrabold mb-0">{card.value}</h3>
                  <span className="small opacity-60">System aggregated total</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Recharts Cost Breakdown Donut Chart */}
      <div className="col-12 col-lg-5">
        <div className="premium-card bg-white p-4 h-100 d-flex flex-column justify-content-between">
          <div>
            <h6 className="fw-bold mb-1 text-dark">Operation Cost Breakdown</h6>
            <p className="text-secondary small mb-0">Visual distribution of logged expense categories.</p>
          </div>

          <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ minHeight: '180px' }}>
            {hasData ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4">
                <p className="text-secondary small mb-0">No active expense data recorded.</p>
              </div>
            )}
          </div>

          {hasData && (
            <div className="d-flex flex-wrap gap-2 justify-content-center small mt-2">
              {data.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center gap-1.5 me-2">
                  <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: item.color }} />
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
