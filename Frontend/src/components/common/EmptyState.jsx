import React from 'react';
import { FiInbox } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function EmptyState({
  title = 'No records found',
  message = 'There is currently no data matching your query.',
  actionText,
  onActionClick
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="d-flex flex-column align-items-center justify-content-center text-center p-5 rounded-4 bg-white border border-opacity-10 w-100 flex-grow-1"
      style={{ minHeight: '300px' }}
    >
      <div
        className="d-flex align-items-center justify-content-center bg-light rounded-circle text-secondary mb-3"
        style={{ width: '64px', height: '64px' }}
      >
        <FiInbox size={28} />
      </div>
      <h3 className="h5 fw-bold text-dark mb-2">{title}</h3>
      <p className="text-secondary mb-4" style={{ fontSize: '0.9rem', maxWidth: '360px' }}>
        {message}
      </p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="btn btn-premium-primary"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
