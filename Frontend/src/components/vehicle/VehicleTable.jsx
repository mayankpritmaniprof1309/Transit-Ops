import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

/**
 * Reusable Table component to display Vehicle lists.
 * @param {Object} props
 * @param {Array} props.vehicles - Array of vehicle records.
 * @param {Function} props.onView - Action triggered when viewing details.
 * @param {Function} props.onEdit - Action triggered when editing.
 * @param {Function} props.onDelete - Action triggered when deleting.
 */
export const VehicleTable = ({ vehicles, onView, onEdit, onDelete }) => {
  // Map status values to CSS status dot classes
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

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="card-solid text-center py-5">
        <p className="mb-0 text-muted">No vehicles available matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-custom">
      <table className="table-custom">
        <thead>
          <tr>
            <th>Reg Number</th>
            <th>Name</th>
            <th>Model</th>
            <th>Type</th>
            <th>Load Capacity</th>
            <th>Odometer</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, idx) => (
            <motion.tr
              key={vehicle._id || idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <td>
                <span className="font-monospace fw-semibold bg-light px-2 py-1 border rounded text-dark">
                  {vehicle.registrationNumber}
                </span>
              </td>
              <td className="fw-semibold">{vehicle.vehicleName}</td>
              <td>{vehicle.vehicleModel}</td>
              <td>
                <span className="text-secondary">{vehicle.vehicleType}</span>
              </td>
              <td>{vehicle.maximumLoadCapacity.toLocaleString()} kg</td>
              <td>{vehicle.odometer.toLocaleString()} km</td>
              <td>
                <span className={`badge-status ${getStatusClass(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </td>
              <td className="text-end">
                <div className="d-inline-flex gap-2">
                  <button
                    onClick={() => onView && onView(vehicle)}
                    className="btn-custom btn-secondary-custom p-2 rounded-circle"
                    title="View Details"
                    style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(vehicle)}
                    className="btn-custom btn-secondary-custom p-2 rounded-circle border-primary text-primary"
                    title="Edit Specs"
                    style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(vehicle._id || vehicle)}
                    className="btn-custom btn-danger-custom p-2 rounded-circle"
                    title="Delete Vehicle"
                    style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
