import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';

export default function RecentTripsTable({ trips = [] }) {
  return (
    <div className="premium-card p-0 h-100 d-flex flex-column overflow-hidden">
      <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-white">
        <h3 className="h6 fw-bold text-dark m-0">Recent Trips</h3>
        <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Last 5 Operations</span>
      </div>

      <div className="table-responsive flex-grow-1">
        <table className="table premium-table m-0">
          <thead>
            <tr>
              <th>Trip No.</th>
              <th>Route</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Status</th>
              <th className="text-end">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-secondary" style={{ fontSize: '0.85rem' }}>
                  No recent trips recorded.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip._id}>
                  <td className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                    {trip.tripNumber}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <span className="fw-medium">{trip.source}</span>
                    <span className="text-secondary mx-1.5">&rarr;</span>
                    <span className="fw-medium">{trip.destination}</span>
                  </td>
                  <td className="text-secondary" style={{ fontSize: '0.85rem' }}>
                    {trip.vehicle ? `${trip.vehicle.registrationNumber}` : '—'}
                  </td>
                  <td className="text-secondary" style={{ fontSize: '0.85rem' }}>
                    {trip.driver ? trip.driver.fullName : '—'}
                  </td>
                  <td>
                    <StatusBadge status={trip.tripStatus} />
                  </td>
                  <td className="text-end fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                    ${trip.expectedRevenue || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
