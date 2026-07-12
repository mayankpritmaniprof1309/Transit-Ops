import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Report summary card.
 * @param {Object} props
 * @param {string} props.title - Card title.
 * @param {string|number} props.value - Main metric value.
 * @param {string} props.subtitle - Subtitle / supporting label.
 * @param {React.ReactNode} props.icon - Icon element.
 * @param {string} props.accentColor - CSS color for icon accent (default: var(--primary)).
 * @param {string} props.badge - Optional small badge text.
 * @param {string} props.badgeVariant - Badge class variant: 'success' | 'warning' | 'danger' | 'info'
 * @param {number} props.delay - Animation delay (default 0).
 */
export const ReportCard = ({
  title = '',
  value = '—',
  subtitle = '',
  icon = null,
  accentColor = 'var(--color-primary)',
  badge = '',
  badgeVariant = 'info',
  delay = 0,
}) => {
  const badgeClass = {
    success: 'bg-success text-white',
    warning: 'bg-warning text-dark',
    danger: 'bg-danger text-white',
    info: 'badge-status-available',
  }[badgeVariant] || 'bg-secondary text-white';

  return (
    <motion.div
      className="card-solid hover-lift h-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        {/* Icon Container */}
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: '48px',
            height: '48px',
            background: `${accentColor}18`,
            color: accentColor,
            fontSize: '1.3rem',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {/* Badge */}
        {badge && (
          <span className={`badge ${badgeClass} px-2 py-1 rounded text-small`}>
            {badge}
          </span>
        )}
      </div>

      {/* Metric */}
      <div className="mb-1">
        <div className="text-dark fw-bold" style={{ fontSize: '1.6rem', lineHeight: '1.2' }}>
          {value}
        </div>
      </div>

      {/* Title + subtitle */}
      <div className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>{title}</div>
      {subtitle && (
        <div className="text-small text-muted mt-1">{subtitle}</div>
      )}
    </motion.div>
  );
};

export default ReportCard;
