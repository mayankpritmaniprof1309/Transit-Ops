import React from 'react';
import { motion } from 'framer-motion';
import { FaGasPump, FaDollarSign, FaTachometerAlt, FaCalendarAlt, FaRoute, FaTrashAlt, FaEdit } from 'react-icons/fa';

/**
 * Reusable Card component to display Fuel log records.
 * @param {Object} props
 * @param {Object} props.fuelLog - Fuel log object data.
 * @param {Function} props.onEdit - Action triggered when editing.
 * @param {Function} props.onDelete - Action triggered when deleting.
 */
export const FuelCard = ({ fuelLog, onEdit, onDelete }) => {
  const {
    _id,
    vehicle,
    trip,
    fuelQuantity,
    fuelCost,
    fuelStation,
    fuelDate,
    odometerReading,
  } = fuelLog;

  const vehicleName = vehicle?.vehicleName || vehicle?.registrationNumber || 'Unknown Vehicle';
  const regNumber = vehicle?.registrationNumber || 'N/A';
  const tripNumber = trip?.tripNumber || trip?.tripCode || 'N/A';

  // Guard against null/undefined values before arithmetic
  const safeQty = Number(fuelQuantity) || 0;
  const safeCost = Number(fuelCost) || 0;
  const safeOdometer = Number(odometerReading) || 0;

  const pricePerUnit = safeQty > 0 ? (safeCost / safeQty).toFixed(2) : '0.00';

  return (
    <motion.div
      className="premium-card h-100 d-flex flex-column justify-content-between"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-light text-dark font-monospace border px-2 py-1 rounded">
            {regNumber}
          </span>
          <span className="badge bg-primary-light text-primary border px-2 py-1 rounded text-small" style={{ background: 'rgba(37, 99, 235, 0.08)' }}>
            <FaGasPump className="me-1" /> Fuel Log
          </span>
        </div>

        <h4 className="mb-1 text-truncate" title={vehicleName}>{vehicleName}</h4>
        <p className="text-small mb-3 text-muted d-flex align-items-center gap-1">
          <FaCalendarAlt /> {fuelDate ? new Date(fuelDate).toLocaleDateString() : 'N/A'}
        </p>

        <div className="row g-2 mb-3">
          {/* Quantity */}
          <div className="col-6">
            <div className="border rounded p-2 bg-light text-center">
              <span className="text-small text-muted d-block">Quantity</span>
              <strong className="text-dark">{safeQty} L</strong>
            </div>
          </div>

          {/* Cost */}
          <div className="col-6">
            <div className="border rounded p-2 bg-light text-center">
              <span className="text-small text-muted d-block">Total Cost</span>
              <strong className="text-dark">${safeCost.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div className="row g-2 mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between text-small text-muted border-bottom pb-2">
              <span className="d-flex align-items-center gap-2"><FaDollarSign /> Unit Price</span>
              <span className="fw-semibold text-dark">${pricePerUnit}/L</span>
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between text-small text-muted border-bottom pb-2">
              <span className="d-flex align-items-center gap-2"><FaTachometerAlt /> Odometer</span>
              <span className="fw-semibold text-dark">{safeOdometer.toLocaleString()} km</span>
            </div>
          </div>
          {trip && (
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between text-small text-muted border-bottom pb-2">
                <span className="d-flex align-items-center gap-2"><FaRoute /> Assigned Trip</span>
                <span className="fw-semibold text-primary">{tripNumber}</span>
              </div>
            </div>
          )}
          {fuelStation && (
            <div className="col-12 mt-2">
              <p className="text-small text-muted mb-0 text-truncate">
                <strong>Station:</strong> {fuelStation}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-auto pt-3 border-top">
        <button
          onClick={() => onEdit && onEdit(fuelLog)}
          className="btn-premium-secondary flex-grow-1 py-2 justify-content-center"
        >
          <FaEdit className="me-1" /> Edit
        </button>
        <button
          onClick={() => onDelete && onDelete(_id)}
          className="btn-premium-danger py-2 justify-content-center"
          style={{ width: '45px', padding: '0' }}
          title="Delete Log"
        >
          <FaTrashAlt />
        </button>
      </div>
    </motion.div>
  );
};

export default FuelCard;
