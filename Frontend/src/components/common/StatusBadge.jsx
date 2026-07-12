import React from 'react';

const statusMap = {
  // Vehicle & Driver Statuses
  available: { bg: '#E6F4EA', color: 'var(--success)' },
  'on trip': { bg: '#FFF7E6', color: 'var(--warning)' },
  'in shop': { bg: '#FCE8E6', color: 'var(--danger)' },
  retired: { bg: '#F1F3F4', color: 'var(--text-secondary)' },
  suspended: { bg: '#FCE8E6', color: 'var(--danger)' },
  'off duty': { bg: '#F1F3F4', color: 'var(--text-secondary)' },

  // Trip Statuses
  draft: { bg: '#EEF4FF', color: 'var(--secondary)' },
  dispatched: { bg: '#FFF7E6', color: 'var(--warning)' },
  completed: { bg: '#E6F4EA', color: 'var(--success)' },
  cancelled: { bg: '#FCE8E6', color: 'var(--danger)' },

  // Maintenance Statuses
  pending: { bg: '#FFF7E6', color: 'var(--warning)' },
  'in progress': { bg: '#EEF4FF', color: 'var(--secondary)' },
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  
  const normalized = status.toLowerCase();
  const config = statusMap[normalized] || { bg: '#F1F3F4', color: 'var(--text-secondary)' };

  return (
    <span
      className="badge rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        fontSize: '0.75rem',
        textTransform: 'capitalize'
      }}
    >
      {status}
    </span>
  );
}
