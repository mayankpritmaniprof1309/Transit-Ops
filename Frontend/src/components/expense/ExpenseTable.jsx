import React from 'react';
import { FaEdit, FaTrashAlt, FaSortAmountDown, FaSortAmountUp, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function ExpenseTable({
  expenses = [],
  onEdit,
  onDelete,
  sortBy = '',
  sortOrder = 'desc',
  onSortChange,
}) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const getCategoryBadgeClass = (type) => {
    switch (type) {
      case 'Fuel':
        return 'bg-blue text-primary';
      case 'Maintenance':
        return 'bg-warning text-warning-dark';
      case 'Toll':
        return 'bg-success text-success-dark';
      case 'Insurance':
        return 'bg-purple text-purple-dark';
      case 'Repair':
        return 'bg-danger text-danger-dark';
      default:
        return 'bg-secondary text-secondary-dark';
    }
  };

  const handleSort = (field) => {
    if (onSortChange) {
      onSortChange(field);
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'desc' ? <FaArrowDown className="ms-1" size={10} /> : <FaArrowUp className="ms-1" size={10} />;
  };

  // Custom CSS colors applied directly inside styles for premium SaaS look
  const categoryStyles = `
    .bg-blue { background-color: rgba(37, 99, 235, 0.1) !important; }
    .text-primary { color: #2563EB !important; }
    .bg-warning { background-color: rgba(245, 158, 11, 0.1) !important; }
    .text-warning-dark { color: #D97706 !important; }
    .bg-success { background-color: rgba(16, 185, 129, 0.1) !important; }
    .text-success-dark { color: #059669 !important; }
    .bg-purple { background-color: rgba(139, 92, 246, 0.1) !important; }
    .text-purple-dark { color: #7C3AED !important; }
    .bg-danger { background-color: rgba(239, 68, 68, 0.1) !important; }
    .text-danger-dark { color: #DC2626 !important; }
  `;

  return (
    <div className="premium-card bg-white p-0 border overflow-hidden">
      <style>{categoryStyles}</style>
      <div className="table-responsive">
        <table className="table premium-table align-middle mb-0">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('expenseDate')} style={{ cursor: 'pointer' }}>
                Date {renderSortIcon('expenseDate')}
              </th>
              <th>Vehicle</th>
              <th>Trip Route</th>
              <th>Category</th>
              <th className="cursor-pointer text-end" onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                Amount {renderSortIcon('amount')}
              </th>
              <th>Payment Method</th>
              <th>Description</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-secondary">
                  No expense records found. Try modifying filters or adding a new record.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => {
                const vehicleReg = expense.vehicle?.registrationNumber || 'N/A';
                const tripRoute = expense.trip ? `${expense.trip.startLocation || 'N/A'} → ${expense.trip.endLocation || 'N/A'}` : 'N/A';
                return (
                  <tr key={expense._id}>
                    <td className="fw-medium text-dark">
                      {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="fw-bold text-secondary">{vehicleReg}</td>
                    <td className="small text-secondary">{tripRoute}</td>
                    <td>
                      <span className={`badge px-2.5 py-1.5 rounded-pill fw-semibold ${getCategoryBadgeClass(expense.expenseType)}`}>
                        {expense.expenseType}
                      </span>
                    </td>
                    <td className="text-end fw-bold text-dark">{formatCurrency(expense.amount)}</td>
                    <td>
                      <span className="badge bg-light text-dark border px-2.5 py-1.5 rounded fw-medium">
                        {expense.paymentMethod}
                      </span>
                    </td>
                    <td className="small text-secondary text-truncate" style={{ maxWidth: '160px' }}>
                      {expense.description || 'N/A'}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => onEdit(expense)}
                          className="btn btn-sm btn-premium-secondary p-2.5 rounded-3"
                          title="Edit Record"
                        >
                          <FaEdit size={14} className="text-primary" />
                        </button>
                        <button
                          onClick={() => onDelete(expense._id)}
                          className="btn btn-sm btn-premium-secondary p-2.5 rounded-3 text-danger border-danger border-opacity-10"
                          title="Delete Record"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
