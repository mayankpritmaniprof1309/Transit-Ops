import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrashAlt, FaStar } from 'react-icons/fa';

/**
 * Reusable Table component to display Driver lists.
 * @param {Object} props
 * @param {Array} props.drivers - Array of driver records.
 * @param {Function} props.onView - Action triggered when viewing details.
 * @param {Function} props.onEdit - Action triggered when editing.
 * @param {Function} props.onDelete - Action triggered when deleting.
 */
export const DriverTable = ({ drivers, onView, onEdit, onDelete }) => {
  // Map status values to CSS status dot classes
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

  if (!drivers || drivers.length === 0) {
    return (
      <div className="card-solid text-center py-5">
        <p className="mb-0 text-muted">No drivers available matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-custom">
      <table className="table-custom">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>License Number</th>
            <th>Category</th>
            <th>Expiry Date</th>
            <th>Contact Number</th>
            <th>Safety Score</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, idx) => (
            <motion.tr
              key={driver._id || idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <td className="fw-semibold">{driver.fullName}</td>
              <td className="font-monospace">{driver.licenseNumber}</td>
              <td>
                <span className="badge bg-light text-dark border px-2 py-1 rounded">
                  {driver.licenseCategory}
                </span>
              </td>
              <td>
                {driver.licenseExpiryDate
                  ? new Date(driver.licenseExpiryDate).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td>{driver.contactNumber}</td>
              <td>
                <span className={`fw-bold d-inline-flex align-items-center gap-1 ${getSafetyScoreColor(driver.safetyScore)}`}>
                  <FaStar className="fs-6" style={{ marginTop: '-2px' }} />
                  {driver.safetyScore}
                </span>
              </td>
              <td>
                <span className={`badge-status ${getStatusClass(driver.status)}`}>
                  {driver.status}
                </span>
              </td>
              <td className="text-end">
                <div className="d-inline-flex gap-2">
                  <button
                    onClick={() => onView && onView(driver)}
                    className="btn-custom btn-secondary-custom p-2 rounded-circle"
                    title="View Portfolio"
                    style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(driver)}
                    className="btn-custom btn-secondary-custom p-2 rounded-circle border-primary text-primary"
                    title="Edit Portfolio"
                    style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(driver._id || driver)}
                    className="btn-custom btn-danger-custom p-2 rounded-circle"
                    title="Suspend/Delete"
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

export default DriverTable;
