import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrashAlt, FaExternalLinkAlt } from 'react-icons/fa';

/**
 * Reusable Table component to display Expense lists.
 * @param {Object} props
 * @param {Array} props.expenses - Array of expense records.
 * @param {Function} props.onEdit - Action triggered when editing.
 * @param {Function} props.onDelete - Action triggered when deleting.
 */
export const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
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

  if (!expenses || expenses.length === 0) {
    return (
      <div className="card-solid text-center py-5">
        <p className="mb-0 text-muted">No expenses documented for this query.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-custom">
      <table className="table-custom">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Trip</th>
            <th>Receipt</th>
            <th>Description</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, idx) => {
            const vehicleName = exp.vehicle?.vehicleName || exp.vehicle?.registrationNumber || 'Unknown Vehicle';
            const regNumber = exp.vehicle?.registrationNumber || 'N/A';
            const tripNumber = exp.trip?.tripNumber || exp.trip?.tripCode || 'N/A';
            const safeAmount = Number(exp.amount) || 0;

            return (
              <motion.tr
                key={exp._id || idx}
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
                <td>
                  <span className={`badge-status ${getTypeBadgeClass(exp.expenseType)}`}>
                    {exp.expenseType}
                  </span>
                </td>
                <td className="fw-bold text-dark">
                  ${safeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>{exp.expenseDate ? new Date(exp.expenseDate).toLocaleDateString() : 'N/A'}</td>
                <td>{exp.paymentMethod || 'N/A'}</td>
                <td>
                  {exp.trip ? (
                    <span className="badge bg-light text-primary border rounded px-2 py-1 text-small">
                      {tripNumber}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  {exp.receiptUrl ? (
                    <a href={exp.receiptUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link text-small text-decoration-none text-primary p-0 d-inline-flex align-items-center gap-1">
                      View <FaExternalLinkAlt size={10} />
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={exp.description}>
                  {exp.description || '—'}
                </td>
                <td className="text-end">
                  <div className="d-inline-flex gap-2">
                    <button
                      onClick={() => onEdit && onEdit(exp)}
                      className="btn-custom btn-secondary-custom p-2 rounded-circle border-primary text-primary"
                      title="Edit"
                      style={{ width: '36px', height: '36px', justifyContent: 'center' }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(exp._id || exp)}
                      className="btn-custom btn-danger-custom p-2 rounded-circle"
                      title="Delete"
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

export default ExpenseTable;
