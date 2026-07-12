import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const TripTable = ({ trips, onEdit, onDelete }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="empty-state">
        <FiEdit />
        <h4>No trips found</h4>
        <p>Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':  return 'badge-status badge-success';
      case 'Dispatched': return 'badge-status badge-info';
      case 'Draft':      return 'badge-status badge-warning';
      case 'Cancelled':  return 'badge-status badge-danger';
      default:           return 'badge-status badge-info';
    }
  };

  return (
    <div className="premium-table-container animate-slide-up">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Trip No.</th>
            <th>Route</th>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(trip => (
            <tr key={trip._id}>
              <td><strong>{trip.tripNumber}</strong></td>
              <td>{trip.source} → {trip.destination}</td>
              <td>{trip.driver?.fullName || trip.driver || 'N/A'}</td>
              <td>{trip.vehicle?.registrationNumber || trip.vehicle || 'N/A'}</td>
              <td>{trip.dispatchDate ? new Date(trip.dispatchDate).toLocaleDateString() : '—'}</td>
              <td>
                <span className={getStatusBadge(trip.tripStatus)}>{trip.tripStatus}</span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-secondary-soft p-2"
                    onClick={() => onEdit(trip)}
                    title="Edit Trip"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-danger-soft p-2"
                    onClick={() => onDelete(trip._id)}
                    disabled={trip.tripStatus === 'Dispatched'}
                    title={trip.tripStatus === 'Dispatched' ? 'Cannot delete — cancel the trip first' : 'Delete Trip'}
                    style={{ opacity: trip.tripStatus === 'Dispatched' ? 0.4 : 1, cursor: trip.tripStatus === 'Dispatched' ? 'not-allowed' : 'pointer' }}
                  >
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

export default TripTable;
