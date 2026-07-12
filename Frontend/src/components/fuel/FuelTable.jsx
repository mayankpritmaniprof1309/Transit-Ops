import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

/**
 * Reusable Table component to display Fuel Log lists.
 * @param {Object} props
 * @param {Array} props.fuelLogs - Array of fuel log records.
 * @param {Function} props.onEdit - Action triggered when editing.
 * @param {Function} props.onDelete - Action triggered when deleting.
 */
export const FuelTable = ({ fuelLogs, onEdit, onDelete }) => {
  // Calculate price per unit
  const getPricePerUnit = (cost, qty) => {
    return qty > 0 ? (cost / qty).toFixed(2) : '0.00';
  };

  if (!fuelLogs || fuelLogs.length === 0) {
    return (
      <div className="card-solid text-center py-5">
        <p className="mb-0 text-muted">No fuel logs registered for this query.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-custom">
      <table className="table-custom">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>Price per Unit</th>
            <th>Odometer Reading</th>
            <th>Fuel Station</th>
            <th>Trip</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fuelLogs.map((log, idx) => {
            const vehicleName = log.vehicle?.vehicleName || log.vehicle?.registrationNumber || 'Unknown Vehicle';
            const regNumber = log.vehicle?.registrationNumber || 'N/A';
            const tripNumber = log.trip?.tripNumber || log.trip?.tripCode || 'N/A';

            return (
              <motion.tr
                key={log._id || idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <td>
                  <div className="d-flex flex-column">
                    <span className="fw-semibold text-dark">{vehicleName}</span>
                    <span className="text-small text-muted font-monospace">{regNumber}</span>
                  </div>
                </td>
                <td>{new Date(log.fuelDate).toLocaleDateString()}</td>
                <td className="fw-semibold">{log.fuelQuantity} L</td>
                <td className="fw-semibold">${log.fuelCost.toLocaleString()}</td>
                <td>
                  <span className="text-muted">${getPricePerUnit(log.fuelCost, log.fuelQuantity)}/L</span>
                </td>
                <td>{log.odometerReading.toLocaleString()} km</td>
                <td>
                  <span className="text-secondary">{log.fuelStation || 'N/A'}</span>
                </td>
                <td>
                  {log.trip ? (
                    <span className="badge bg-light text-primary border rounded px-2 py-1 text-small">
                      {tripNumber}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="d-inline-flex gap-2">
                    <button
                      onClick={() => onEdit && onEdit(log)}
                      className="btn-custom btn-secondary-custom p-2 rounded-circle border-primary text-primary"
                      title="Edit Log"
                      style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(log._id || log)}
                      className="btn-custom btn-danger-custom p-2 rounded-circle"
                      title="Delete Log"
                      style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FuelTable;
