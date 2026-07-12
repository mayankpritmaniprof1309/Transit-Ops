import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while retrieving your data.',
  onRetry
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="d-flex flex-column align-items-center justify-content-center text-center p-5 rounded-4 bg-white border border-danger border-opacity-15 w-100 flex-grow-1"
      style={{ minHeight: '300px' }}
    >
      <div
        className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle text-danger mb-3"
        style={{ width: '64px', height: '64px' }}
      >
        <FiAlertTriangle size={28} />
      </div>
      <h3 className="h5 fw-bold text-dark mb-2">{title}</h3>
      <p className="text-secondary mb-4" style={{ fontSize: '0.9rem', maxWidth: '400px' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-premium-primary"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}
