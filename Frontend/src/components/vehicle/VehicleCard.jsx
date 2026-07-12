import React from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaMapMarkerAlt, FaWeightHanging, FaTachometerAlt } from 'react-icons/fa';

/**
 * Reusable Card component to display Vehicle summary information.
 * @param {Object} props
 * @param {Object} props.vehicle - Vehicle object data.
 * @param {Function} props.onView - Action triggered when viewing details.
 * @param {Function} props.onEdit - Action triggered when editing.
 */
export const VehicleCard = ({ vehicle, onView, onEdit }) => {
  const {
    registrationNumber,
    vehicleName,
    vehicleModel,
    vehicleType,
    maximumLoadCapacity,
    odometer,
    status,
    region,
  } = vehicle;

  // Map status values to TransitOps CSS classes
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
            {registrationNumber}
          </span>
          <span className={`badge-status ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>

        <h4 className="mb-1 text-truncate">{vehicleName}</h4>
        <p className="text-small mb-3 text-truncate">{vehicleModel} • {vehicleType}</p>

        <div className="row g-2 mb-4">
          <div className="col-6">
            <div className="d-flex align-items-center gap-2 text-muted text-small">
              <FaWeightHanging className="text-primary" />
              <span>{maximumLoadCapacity} kg</span>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2 text-muted text-small">
              <FaTachometerAlt className="text-primary" />
              <span>{odometer.toLocaleString()} km</span>
            </div>
          </div>
          {region && (
            <div className="col-12">
              <div className="d-flex align-items-center gap-2 text-muted text-small">
                <FaMapMarkerAlt className="text-primary" />
                <span className="text-truncate">{region}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-auto">
        <button
          onClick={() => onView && onView(vehicle)}
          className="btn-custom btn-secondary-custom flex-grow-1 py-2 justify-content-center"
        >
          View Specs
        </button>
        <button
          onClick={() => onEdit && onEdit(vehicle)}
          className="btn-custom btn-primary-gradient py-2 justify-content-center"
          style={{ width: '45px', padding: '0' }}
          title="Edit Vehicle"
        >
          ✏️
        </button>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
