import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader({ type = 'table', rows = 5, cols = 4 }) {
  const pulseTransition = {
    repeat: Infinity,
    duration: 1.2,
    ease: 'easeInOut',
    repeatType: 'reverse'
  };

  const renderTableSkeleton = () => (
    <div className="w-100 premium-table p-0">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.05)' }}>
                  <motion.div
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={pulseTransition}
                    className="bg-secondary bg-opacity-20 rounded-2"
                    style={{ height: '14px', width: '70%' }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.05)', padding: '1.25rem' }}>
                    <motion.div
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={pulseTransition}
                      className="bg-secondary bg-opacity-15 rounded-2"
                      style={{ height: '16px', width: c === 0 ? '50%' : '80%' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="row g-4 w-100 m-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="col-12 col-md-6 col-lg-4">
          <div className="premium-card p-4 h-100 d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={pulseTransition}
                className="bg-secondary bg-opacity-25 rounded-circle"
                style={{ width: '40px', height: '40px' }}
              />
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={pulseTransition}
                className="bg-secondary bg-opacity-20 rounded-pill"
                style={{ width: '60px', height: '20px' }}
              />
            </div>
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={pulseTransition}
              className="bg-secondary bg-opacity-20 rounded-2"
              style={{ height: '20px', width: '75%' }}
            />
            <div className="d-flex flex-column gap-2 mt-2">
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={pulseTransition}
                className="bg-secondary bg-opacity-15 rounded-2"
                style={{ height: '14px', width: '90%' }}
              />
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={pulseTransition}
                className="bg-secondary bg-opacity-15 rounded-2"
                style={{ height: '14px', width: '60%' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return type === 'card' ? renderCardSkeleton() : renderTableSkeleton();
}
