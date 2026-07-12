import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaUser, FaPhone, FaShieldAlt, FaIdCard, FaEnvelope, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { getDriver } from '../../services/driver.service.js';

/**
 * Dedicated profile and stats sheet view for a Driver.
 * @param {Object} props
 * @param {string} props.driverId - Driver ID to load.
 * @param {Function} props.onBack - Callback to return to the directory.
 * @param {Function} props.onEdit - Callback to trigger editing.
 */
export const ViewDriver = ({ driverId, onBack, onEdit }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (driverId) {
      const fetchDriver = async () => {
        try {
          setLoading(true);
          setError('');
          const res = await getDriver(driverId);
          if (res.success) {
            setDriver(res.data);
          } else {
            setError(res.message || 'Failed to retrieve driver portfolio details');
          }
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || 'Server connection error');
        } finally {
          setLoading(false);
        }
      };
      fetchDriver();
    }
  }, [driverId]);

  const getStatusClass = (statusVal) => {
    switch (statusVal) {
      case 'Available':
        return 'badge-status-available';
      case 'On Trip':
        return 'badge-status-on-trip';
      case 'Off Duty':
        return 'badge-status-in-shop';
      case 'Suspended':
        return 'badge-status-retired';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-warning';
    return 'text-danger';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '800px' }}>
        <div className="card-solid p-5">
          <div className="skeleton-shimmer skeleton-circle mb-4" style={{ width: '80px', height: '80px' }}></div>
          <div className="skeleton-shimmer skeleton-box w-25 mb-4 mx-auto" style={{ height: '2rem' }}></div>
          <div className="skeleton-shimmer skeleton-box w-50 mb-3 mx-auto"></div>
          <div className="skeleton-shimmer skeleton-box w-75 mb-3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm" role="alert">
          {error || 'Driver portfolio not found'}
        </div>
        <button onClick={onBack} className="btn-custom btn-secondary-custom">
          <FaArrowLeft /> Back to Driver List
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      {/* Navigation and Edit buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={onBack} className="btn-custom btn-secondary-custom">
          <FaArrowLeft /> Back
        </button>
        <button onClick={() => onEdit(driverId)} className="btn-custom btn-primary-gradient shadow-sm">
          <FaEdit /> Edit Portfolio
        </button>
      </div>

      <motion.div
        className="card-solid"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Banner Details */}
        <div className="text-center pb-4 mb-4 border-bottom">
          <div className="d-inline-block bg-primary-light text-primary p-3 rounded-circle mb-3" style={{ background: 'rgba(37, 99, 235, 0.08)' }}>
            <FaUser className="fs-1" />
          </div>
          <h2 className="mb-1">{driver.fullName}</h2>
          <span className="text-small font-monospace mb-3 bg-light d-inline-block px-3 py-1 border rounded text-dark">
            Cat. {driver.licenseCategory}
          </span>
          <div className="mt-2">
            <span className={`badge-status ${getStatusClass(driver.status)}`}>
              {driver.status}
            </span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="row g-3">
          {/* Safety Rating */}
          <div className="col-12">
            <div className="border rounded p-3 text-center bg-light">
              <span className="text-small text-muted d-block mb-1">Safety Rating Score</span>
              <strong className={`fs-2 ${getSafetyScoreColor(driver.safetyScore)}`}>
                {driver.safetyScore} / 100
              </strong>
            </div>
          </div>

          {/* License Number */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaIdCard className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">License Number</span>
                <strong className="text-dark fs-5 font-monospace">{driver.licenseNumber}</strong>
              </div>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light">
              <span className="text-small text-muted d-block">License Expiry</span>
              <strong className="text-dark fs-5">
                {driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString() : 'N/A'}
              </strong>
            </div>
          </div>

          {/* Contact Number */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaPhone className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">Contact Number</span>
                <strong className="text-dark fs-5">{driver.contactNumber}</strong>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaEnvelope className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">Email Address</span>
                <strong className="text-dark fs-5 text-truncate d-block" style={{ maxWidth: '280px' }} title={driver.email}>
                  {driver.email || 'N/A'}
                </strong>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="col-sm-12">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaExclamationTriangle className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">Emergency Contact Information</span>
                <strong className="text-dark fs-6">{driver.emergencyContact || 'Not Specified'}</strong>
              </div>
            </div>
          </div>

          {/* Address */}
          {driver.address && (
            <div className="col-sm-12">
              <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                <FaMapMarkerAlt className="text-primary fs-3" />
                <div>
                  <span className="text-small text-muted d-block">Residential Address</span>
                  <span className="text-dark fw-semibold">{driver.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-top d-flex justify-content-between text-small text-muted">
          <span>Enrolled: {new Date(driver.createdAt).toLocaleDateString()}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewDriver;
