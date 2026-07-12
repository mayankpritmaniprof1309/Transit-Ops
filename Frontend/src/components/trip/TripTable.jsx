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
      case 'Completed': return 'badge-status badge-success';
      case 'In Progress': return 'badge-status badge-info';
      case 'Scheduled': return 'badge-status badge-warning';
      default: return 'badge-status badge-info';
    }
  };

  return (
    <div className="premium-table-container animate-slide-up">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Trip ID</th>
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
            <tr key={trip._id || trip.id}>
              <td>#{trip.tripNumber || trip.id}</td>
              <td>{trip.route || `${trip.source} to ${trip.destination}`}</td>
              <td>{trip.driver?.fullName || trip.driver?.name || trip.driver || 'Unknown'}</td>
              <td>{trip.vehicle?.registrationNumber || trip.vehicle?.vehicleName || trip.vehicle || 'Unknown'}</td>
              <td>{trip.dispatchDate ? new Date(trip.dispatchDate).toLocaleDateString() : trip.date}</td>
              <td>
                <span className={getStatusBadge(trip.tripStatus || trip.status)}>{trip.tripStatus || trip.status}</span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-secondary-soft p-2" onClick={() => onEdit(trip)}>
                    <FiEdit />
                  </button>
                  <button className="btn btn-sm btn-danger-soft p-2" onClick={() => onDelete(trip._id || trip.id)}>
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
