import React from 'react';
import { motion } from 'framer-motion';
import { FaIdCard, FaPhone, FaShieldAlt, FaEnvelope } from 'react-icons/fa';

/**
 * Reusable Card component to display Driver summary.
 * @param {Object} props
 * @param {Object} props.driver - Driver object data.
 * @param {Function} props.onView - Action triggered when viewing details.
 * @param {Function} props.onEdit - Action triggered when editing.
 */
export const DriverCard = ({ driver, onView, onEdit }) => {
  const {
    fullName,
    licenseNumber,
    licenseCategory,
    contactNumber,
    email,
    safetyScore = 100,
    status = 'Available',
  } = driver;

  // Map status values to CSS classes
  const getStatusClass = (statusVal) => {
    switch (statusVal) {
      case 'Available':
        return 'badge-status-available';
      case 'On Trip':
        return 'badge-status-on-trip';
      case 'Off Duty':
        return 'badge-status-in-shop'; // Uses status-warning gold
      case 'Suspended':
        return 'badge-status-retired'; // Uses status-danger red
      default:
        return 'bg-secondary text-white';
    }
  };

  // Get safety score text color class
  const getSafetyScoreClass = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-warning';
    return 'text-danger';
  };

  return (
    <motion.div
      className="card-solid hover-lift h-100 d-flex flex-column justify-content-between"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-light text-dark font-monospace border px-2 py-1 rounded">
            Cat. {licenseCategory}
          </span>
          <span className={`badge-status ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>

        <h4 className="mb-1 text-truncate">{fullName}</h4>
        <p className="text-small mb-3 text-muted d-flex align-items-center gap-1">
          <FaIdCard /> {licenseNumber}
        </p>

        <div className="row g-2 mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center gap-2 text-muted text-small">
              <FaPhone className="text-primary" />
              <span>{contactNumber}</span>
            </div>
          </div>
          {email && (
            <div className="col-12">
              <div className="d-flex align-items-center gap-2 text-muted text-small">
                <FaEnvelope className="text-primary" />
                <span className="text-truncate">{email}</span>
              </div>
            </div>
          )}
          <div className="col-12 mt-2">
            <div className="d-flex align-items-center justify-content-between border rounded p-2 bg-light">
              <div className="d-flex align-items-center gap-2 text-muted text-small">
                <FaShieldAlt className="text-primary" />
                <span>Safety Score</span>
              </div>
              <strong className={`fs-5 ${getSafetyScoreClass(safetyScore)}`}>
                {safetyScore}/100
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mt-auto">
        <button
          onClick={() => onView && onView(driver)}
          className="btn-custom btn-secondary-custom flex-grow-1 py-2 justify-content-center"
        >
          View File
        </button>
        <button
          onClick={() => onEdit && onEdit(driver)}
          className="btn-custom btn-primary-gradient py-2 justify-content-center"
          style={{ width: '45px', padding: '0' }}
          title="Edit Driver"
        >
          ✏️
        </button>
      </div>
    </motion.div>
  );
};

export default DriverCard;
