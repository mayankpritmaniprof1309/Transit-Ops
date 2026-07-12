import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ size = 50, color = 'var(--primary)', message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 w-100 h-100 flex-grow-1">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{
          width: size,
          height: size,
          border: '4px solid rgba(37, 99, 235, 0.1)',
          borderTop: `4px solid ${color}`,
          borderRadius: '50%'
        }}
      />
      {message && (
        <span className="mt-3 text-secondary fw-medium" style={{ fontSize: '0.875rem' }}>
          {message}
        </span>
      )}
    </div>
  );
}
