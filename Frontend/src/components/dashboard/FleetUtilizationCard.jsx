import React from 'react';
import { motion } from 'framer-motion';

export default function FleetUtilizationCard({ active = 0, total = 0, utilization = 0 }) {
  return (
    <div className="premium-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>
            Fleet Utilization
          </span>
          <span className="badge bg-primary bg-opacity-10 text-primary px-2.5 py-1 fw-bold" style={{ fontSize: '0.75rem' }}>
            Formula Metric
          </span>
        </div>
        
        <div className="d-flex align-items-baseline gap-2 mt-3 mb-1">
          <span className="h1 fw-bold text-dark m-0" style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>
            {utilization}%
          </span>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
            utilization rate
          </span>
        </div>
        
        <p className="text-secondary m-0 mt-2" style={{ fontSize: '0.825rem', lineHeight: '1.4' }}>
          Calculated dynamically as: <code className="text-dark fw-medium">(Vehicles On Trip / Total Vehicles) &times; 100</code>
        </p>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between text-secondary mb-1.5" style={{ fontSize: '0.8rem' }}>
          <span>{active} Vehicles active</span>
          <span>{total} Vehicles total</span>
        </div>
        <div className="progress rounded-pill bg-light" style={{ height: '8px' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${utilization}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="progress-bar rounded-pill bg-primary"
            role="progressbar"
            aria-valuenow={utilization}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>
    </div>
  );
}
