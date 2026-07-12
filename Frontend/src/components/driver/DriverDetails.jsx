import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaPhone, FaShieldAlt, FaIdCard, FaEnvelope, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Reusable detail specifications Overlay component for a Driver.
 * @param {Object} props
 * @param {Object} props.driver - The driver detailed object data.
 * @param {Function} props.onClose - Action triggered when closing details.
 */
export const DriverDetails = ({ driver, onClose }) => {
  if (!driver) return null;

  const {
    fullName,
    licenseNumber,
    licenseCategory,
    licenseExpiryDate,
    contactNumber,
    email,
    safetyScore = 100,
    status = 'Available',
    address,
    emergencyContact,
    createdAt,
  } = driver;

  // Map status values to CSS classes
  const getStatusClass = (statusVal) => {
    switch (statusVal) {
      case 'Available':
        return 'badge-status-available';
      case 'On Trip':
        return 'badge-status-on-trip';
      case 'Off Duty':
        return 'badge-status-in-shop'; // Gold warning
      case 'Suspended':
        return 'badge-status-retired'; // Red danger
      default:
        return 'bg-secondary text-white';
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-success border-success';
    if (score >= 75) return 'text-warning border-warning';
    return 'text-danger border-danger';
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay-custom">
        <motion.div
          className="modal-content-custom"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="modal-header-custom bg-light">
            <div className="d-flex align-items-center gap-2">
              <FaUser className="text-primary fs-4" />
              <h4 className="mb-0">Driver Portfolio</h4>
            </div>
            <button
              onClick={onClose}
              className="btn border-0 p-1 text-muted hover-scale"
              style={{ background: 'transparent' }}
            >
              <FaTimes className="fs-5" />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body-custom">
            <div className="text-center mb-4">
              <span className={`badge-status mb-2 ${getStatusClass(status)}`}>
                {status}
              </span>
              <h3 className="mb-1">{fullName}</h3>
              <p className="text-small font-monospace mb-0 text-muted">
                Driver ID: {driver._id || 'N/A'}
              </p>
            </div>

            <div className="row g-3">
              {/* Safety Score Card */}
              <div className="col-12">
                <div className={`border rounded p-3 text-center bg-light border-2 d-flex flex-column align-items-center justify-content-center`}>
                  <div className="d-flex align-items-center gap-2 text-muted text-small mb-1">
                    <FaShieldAlt className="text-primary" />
                    <span>Safety Rating Score</span>
                  </div>
                  <strong className={`fs-3 ${getSafetyScoreColor(safetyScore).split(' ')[0]}`}>
                    {safetyScore} / 100
                  </strong>
                </div>
              </div>

              {/* License Number */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaIdCard className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">License Number</span>
                    <strong className="text-dark font-monospace">{licenseNumber}</strong>
                  </div>
                </div>
              </div>

              {/* License Category */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light">
                  <span className="text-small text-muted d-block">License Category</span>
                  <strong className="text-dark">Class {licenseCategory}</strong>
                </div>
              </div>

              {/* Contact Info */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaPhone className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">Contact Number</span>
                    <strong className="text-dark">{contactNumber}</strong>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaEnvelope className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">Email Address</span>
                    <strong className="text-dark text-truncate d-block" style={{ maxWidth: '120px' }} title={email}>
                      {email || 'N/A'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light">
                  <span className="text-small text-muted d-block">License Expiry</span>
                  <strong className="text-dark">
                    {licenseExpiryDate ? new Date(licenseExpiryDate).toLocaleDateString() : 'N/A'}
                  </strong>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaExclamationTriangle className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">Emergency Contact</span>
                    <strong className="text-dark text-truncate d-block" style={{ maxWidth: '120px' }} title={emergencyContact}>
                      {emergencyContact || 'N/A'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Address */}
              {address && (
                <div className="col-12">
                  <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                    <FaMapMarkerAlt className="text-primary fs-4" />
                    <div>
                      <span className="text-small text-muted d-block">Residential Address</span>
                      <span className="text-dark text-small fw-semibold">{address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {createdAt && (
              <div className="mt-4 pt-3 border-top text-center text-small text-muted">
                Enrolled on: {new Date(createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer-custom">
            <button
              onClick={onClose}
              className="btn-custom btn-primary-gradient px-4"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DriverDetails;
