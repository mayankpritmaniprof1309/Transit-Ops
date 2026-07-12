import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  FaDollarSign,
  FaFileInvoiceDollar,
  FaChartLine,
  FaCheckCircle,
  FaHourglassHalf,
  FaTruck,
  FaUserTie,
  FaGasPump,
} from 'react-icons/fa';

// Custom card animation variant
const cardVariants = {
  hover: {
    y: -5,
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
};

// Generates simple mock sparkline history to make card visual active
const getSparklineData = (baseVal, variance) => {
  return [...Array(6)].map((_, i) => ({
    value: baseVal * (0.85 + Math.random() * variance),
  }));
};

export default function SummaryCards({ metrics = {} }) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${(metrics.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <FaDollarSign />,
      colorClass: 'text-primary bg-primary bg-opacity-10',
      sparkColor: '#2563EB',
      sparkData: getSparklineData(1000, 0.3),
    },
    {
      title: 'Total Operational Cost',
      value: `$${(metrics.totalOperationalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <FaFileInvoiceDollar />,
      colorClass: 'text-danger bg-danger bg-opacity-10',
      sparkColor: '#EF4444',
      sparkData: getSparklineData(800, 0.2),
    },
    {
      title: 'Fleet Utilization',
      value: `${metrics.fleetUtilization || 0}%`,
      icon: <FaChartLine />,
      colorClass: 'text-success bg-success bg-opacity-10',
      sparkColor: '#10B981',
      sparkData: getSparklineData(70, 0.15),
    },
    {
      title: 'Completed Trips',
      value: (metrics.completedTrips || 0).toLocaleString(),
      icon: <FaCheckCircle />,
      colorClass: 'text-info bg-info bg-opacity-10',
      sparkColor: '#06B6D4',
      sparkData: getSparklineData(120, 0.4),
    },
    {
      title: 'Pending Trips',
      value: (metrics.pendingTrips || 0).toLocaleString(),
      icon: <FaHourglassHalf />,
      colorClass: 'text-warning bg-warning bg-opacity-10',
      sparkColor: '#F59E0B',
      sparkData: getSparklineData(30, 0.5),
    },
    {
      title: 'Active Vehicles',
      value: (metrics.activeVehicles || 0).toLocaleString(),
      icon: <FaTruck />,
      colorClass: 'text-dark bg-secondary bg-opacity-10',
      sparkColor: '#64748B',
      sparkData: getSparklineData(45, 0.1),
    },
    {
      title: 'Drivers On Duty',
      value: (metrics.driversOnDuty || 0).toLocaleString(),
      icon: <FaUserTie />,
      colorClass: 'text-primary bg-primary bg-opacity-10',
      sparkColor: '#3B82F6',
      sparkData: getSparklineData(35, 0.12),
    },
    {
      title: 'Fuel Consumed',
      value: `${(metrics.fuelConsumed || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} L`,
      icon: <FaGasPump />,
      colorClass: 'text-warning bg-warning bg-opacity-10',
      sparkColor: '#D97706',
      sparkData: getSparklineData(5000, 0.25),
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card, idx) => (
        <div key={idx} className="col-12 col-sm-6 col-lg-3">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="premium-card bg-white p-3 d-flex flex-column justify-content-between cursor-pointer border shadow-sm"
            style={{ height: '120px' }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-secondary d-block mb-1 fw-medium" style={{ fontSize: '0.78rem', letterSpacing: '-0.01em' }}>
                  {card.title}
                </span>
                <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
                  {card.value}
                </h4>
              </div>
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center ${card.colorClass}`}
                style={{ width: '34px', height: '34px', fontSize: '1rem' }}
              >
                {card.icon}
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ height: '30px', width: '100%' }} className="mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={card.sparkData}>
                  <defs>
                    <linearGradient id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={card.sparkColor} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={card.sparkColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={card.sparkColor}
                    strokeWidth={1.5}
                    fill={`url(#grad-${idx})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
