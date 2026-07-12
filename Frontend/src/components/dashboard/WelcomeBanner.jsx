import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiTrendingUp } from 'react-icons/fi';

export default function WelcomeBanner({ user = {} }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 mb-4 text-white overflow-hidden position-relative shadow-sm"
      style={{
        borderRadius: '18px',
        background: 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)'
      }}
    >
      {/* Decorative vector elements */}
      <div
        className="position-absolute end-0 top-0 bg-white opacity-10 rounded-circle"
        style={{ width: '220px', height: '220px', transform: 'translate(40px, -40px)' }}
      />
      <div
        className="position-absolute end-0 bottom-0 bg-white opacity-5 rounded-circle"
        style={{ width: '120px', height: '120px', transform: 'translate(10px, 40px)' }}
      />

      <div className="position-relative z-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <span className="badge bg-white bg-opacity-25 text-white mb-2 px-2.5 py-1.5 fw-medium d-inline-flex align-items-center gap-1">
            <FiTrendingUp size={12} />
            <span>Operations Dashboard</span>
          </span>
          <h2 className="fw-bold m-0" style={{ fontSize: '1.75rem', letterSpacing: '-0.025em' }}>
            Welcome back, {user?.fullName || 'TransitOps User'}!
          </h2>
          <p className="m-0 mt-1 opacity-75" style={{ fontSize: '0.95rem' }}>
            Here is the current operational status of your smart transport fleet.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 bg-white bg-opacity-15 px-3 py-2 rounded-3 text-white" style={{ fontSize: '0.85rem' }}>
          <FiCalendar size={16} />
          <span className="fw-medium">{currentDate}</span>
        </div>
      </div>
    </motion.div>
  );
}
