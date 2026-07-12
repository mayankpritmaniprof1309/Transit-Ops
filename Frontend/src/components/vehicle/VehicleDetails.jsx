import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTruck, FaWarehouse, FaDollarSign, FaWeightHanging, FaTachometerAlt } from 'react-icons/fa';

/**
 * Reusable detail specifications Overlay component for a Vehicle.
 * @param {Object} props
 * @param {Object} props.vehicle - The vehicle detailed object data.
 * @param {Function} props.onClose - Action triggered when closing details.
 */
export const VehicleDetails = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const {
    registrationNumber,
    vehicleName,
    vehicleModel,
    vehicleType,
    maximumLoadCapacity,
    odometer,
    acquisitionCost,
    status,
    region,
    createdAt,
    updatedAt,
  } = vehicle;

  const getStatusClass = (statusVal) => {
    switch (statusVal) {
      case 'Available':
        return 'badge-status-available';
      case 'On Trip':
        return 'badge-status-on-trip';
      case 'In Shop':
        return 'badge-status-in-shop';
      case 'Retired':
        return 'badge-status-retired';
      default:
        return 'bg-secondary text-white';
    }
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
              <FaTruck className="text-primary fs-4" />
              <h4 className="mb-0">Specs Sheet</h4>
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
              <h3 className="mb-1">{vehicleName}</h3>
              <p className="text-small font-monospace mb-0 bg-light d-inline-block px-3 py-1 border rounded">
                {registrationNumber}
              </p>
            </div>

            <div className="row g-3">
              {/* Type */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light">
                  <span className="text-small text-muted d-block">Vehicle Type</span>
                  <strong className="text-dark">{vehicleType}</strong>
                </div>
              </div>

              {/* Model */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light">
                  <span className="text-small text-muted d-block">Model Spec</span>
                  <strong className="text-dark text-truncate d-block" title={vehicleModel}>
                    {vehicleModel}
                  </strong>
                </div>
              </div>

              {/* Capacity */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaWeightHanging className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">Load Capacity</span>
                    <strong className="text-dark">{maximumLoadCapacity.toLocaleString()} kg</strong>
                  </div>
                </div>
              </div>

              {/* Odometer */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaTachometerAlt className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">Odometer Reading</span>
                    <strong className="text-dark">{odometer.toLocaleString()} km</strong>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaDollarSign className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">Acquisition Cost</span>
                    <strong className="text-dark">${acquisitionCost.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Region */}
              <div className="col-6">
                <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
                  <FaWarehouse className="text-primary fs-4" />
                  <div>
                    <span className="text-small text-muted d-block">Operating Region</span>
                    <strong className="text-dark text-truncate d-block" style={{ maxWidth: '120px' }}>
                      {region || 'N/A'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {createdAt && (
              <div className="mt-4 pt-3 border-top text-center text-small text-muted">
                Registered on: {new Date(createdAt).toLocaleDateString()}
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

export default VehicleDetails;
