import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiCheckCircle, FiMapPin, FiUsers } from 'react-icons/fi';

export default function KPICards({ data = {} }) {
  const kpis = [
    {
      title: 'Total Vehicles',
      value: data.totalVehicles ?? 0,
      icon: FiTruck,
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.1)'
    },
    {
      title: 'Available Vehicles',
      value: data.availableVehicles ?? 0,
      icon: FiCheckCircle,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Active Trips',
      value: data.activeTrips ?? 0,
      icon: FiMapPin,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Total Drivers',
      value: data.totalDrivers ?? 0,
      icon: FiUsers,
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.1)'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' }
    })
  };

  return (
    <div className="row g-4 mb-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.title} className="col-12 col-sm-6 col-xl-3">
            <motion.div
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-effect rounded-4 p-4 d-flex align-items-center justify-content-between"
              style={{
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)'
              }}
            >
              <div className="d-flex flex-column">
                <span className="text-secondary fw-medium mb-1" style={{ fontSize: '0.85rem' }}>
                  {kpi.title}
                </span>
                <span className="h2 fw-bold text-dark m-0" style={{ letterSpacing: '-0.03em' }}>
                  {kpi.value}
                </span>
              </div>
              <div
                className="d-flex align-items-center justify-content-center rounded-3 text-primary"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: kpi.bg,
                  color: kpi.color
                }}
              >
                <Icon size={22} style={{ color: kpi.color }} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
