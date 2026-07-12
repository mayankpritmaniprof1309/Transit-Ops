import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ title, description, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
    >
      <div>
        <h1 className="h3 fw-bold text-dark m-0">{title}</h1>
        {description && (
          <p className="text-secondary m-0 mt-1" style={{ fontSize: '0.9rem' }}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {actions}
        </div>
      )}
    </motion.div>
  );
}
