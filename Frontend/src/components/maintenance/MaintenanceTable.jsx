import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const MaintenanceTable = ({ records, onDelete }) => {
  if (!records || records.length === 0) {
    return (
      <div className="empty-state">
        <FiEdit />
        <h4>No maintenance records found</h4>
        <p>Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'badge-status badge-success';
      case 'In Progress': return 'badge-status badge-warning';
      case 'Pending': return 'badge-status badge-danger';
      default: return 'badge-status badge-info';
    }
  };

  return (
    <div className="premium-table-container animate-slide-up">
      <table className="premium-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Date</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              <td>#{record.id}</td>
              <td>{record.vehicle}</td>
              <td>{record.type}</td>
              <td>{record.date}</td>
              <td>${record.cost}</td>
              <td>
                <span className={getStatusBadge(record.status)}>{record.status}</span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-secondary-soft p-2">
                    <FiEdit />
                  </button>
                  <button className="btn btn-sm btn-danger-soft p-2" onClick={() => onDelete(record.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;
