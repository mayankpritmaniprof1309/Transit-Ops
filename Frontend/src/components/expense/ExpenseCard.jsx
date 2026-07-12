import React from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaCalendarAlt, FaCreditCard, FaReceipt, FaRoute, FaEdit, FaTrashAlt } from 'react-icons/fa';

/**
 * Reusable Card component to display Expense records.
 * @param {Object} props
 * @param {Object} props.expense - Expense object data.
 * @param {Function} props.onEdit - Action triggered when editing.
 * @param {Function} props.onDelete - Action triggered when deleting.
 */
export const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const {
    _id,
    vehicle,
    trip,
    expenseType,
    amount,
    expenseDate,
    paymentMethod,
    description,
    receiptUrl,
  } = expense;

  const vehicleName = vehicle?.vehicleName || vehicle?.registrationNumber || 'Unknown Vehicle';
  const regNumber = vehicle?.registrationNumber || 'N/A';
  const tripNumber = trip?.tripNumber || trip?.tripCode || 'N/A';

  // Guard null/undefined amount before calling toLocaleString
  const safeAmount = Number(amount) || 0;

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Fuel':
        return 'badge-status-available';
      case 'Maintenance':
      case 'Repair':
        return 'badge-status-in-shop';
      case 'Insurance':
        return 'badge-status-on-trip';
      case 'Toll':
      case 'Other':
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <motion.div
      className="card-solid hover-lift h-100 d-flex flex-column justify-content-between"
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
          <span className={`badge-status ${getTypeBadgeClass(expenseType)}`}>
            {expenseType}
          </span>
        </div>

        <h4 className="mb-1 text-truncate" title={vehicleName}>{vehicleName}</h4>
        <p className="text-small mb-3 text-muted d-flex align-items-center gap-1">
          <FaCalendarAlt /> {expenseDate ? new Date(expenseDate).toLocaleDateString() : 'N/A'}
        </p>

        <div className="border rounded p-3 mb-3 bg-light text-center">
          <span className="text-small text-muted d-block mb-1">Expense Amount</span>
          <strong className="text-dark fs-3">
            ${safeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>

        <div className="row g-2 mb-4 text-small text-muted">
          <div className="col-12 border-bottom pb-2 d-flex justify-content-between align-items-center">
            <span className="d-flex align-items-center gap-2"><FaCreditCard /> Payment</span>
            <span className="fw-semibold text-dark">{paymentMethod || 'N/A'}</span>
          </div>
          {trip && (
            <div className="col-12 border-bottom pb-2 d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center gap-2"><FaRoute /> Assigned Trip</span>
              <span className="fw-semibold text-primary">{tripNumber}</span>
            </div>
          )}
          {receiptUrl && (
            <div className="col-12 border-bottom pb-2 d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center gap-2"><FaReceipt /> Receipt</span>
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none text-primary text-truncate" style={{ maxWidth: '160px' }}>
                View
              </a>
            </div>
          )}
          {description && (
            <div className="col-12 mt-2">
              <p className="mb-0 text-truncate" title={description}>
                <strong>Notes:</strong> {description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-auto pt-3 border-top">
        <button
          onClick={() => onEdit && onEdit(expense)}
          className="btn-custom btn-secondary-custom flex-grow-1 py-2 justify-content-center"
        >
          <FaEdit className="me-1" /> Edit
        </button>
        <button
          onClick={() => onDelete && onDelete(_id)}
          className="btn-custom btn-danger-custom py-2 justify-content-center"
          style={{ width: '45px', padding: '0' }}
          title="Delete"
        >
          <FaTrashAlt />
        </button>
      </div>
    </motion.div>
  );
};

export default ExpenseCard;
