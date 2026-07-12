import React, { useState } from 'react';
import { FaRoute, FaGasPump, FaWrench, FaExclamationTriangle, FaCalendarAlt, FaIdCard, FaWeightHanging } from 'react-icons/fa';

export default function RecentTrips({
  trips = [],
  fuelLogs = [],
  maintenance = [],
  drivers = [],
}) {
  const [activeTab, setActiveTab] = useState('trips');

  // Filter alerts
  const upcomingExpiryDrivers = drivers
    .map((d) => {
      const daysLeft = d.licenseExpiryDate
        ? Math.ceil((new Date(d.licenseExpiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null;
      return { ...d, daysLeft };
    })
    .filter((d) => d.daysLeft !== null && d.daysLeft <= 90)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const upcomingMaintenance = maintenance
    .filter((m) => m.maintenanceStatus === 'Scheduled' || m.maintenanceStatus === 'In Progress')
    .slice(0, 5);

  const tabs = [
    { id: 'trips', label: 'Recent Trips', icon: <FaRoute className="me-2" /> },
    { id: 'fuel', label: 'Latest Fuel Logs', icon: <FaGasPump className="me-2" /> },
    { id: 'maintenance', label: 'Upcoming Maintenance', icon: <FaWrench className="me-2" /> },
    {
      id: 'alerts',
      label: 'License Alerts',
      icon: <FaExclamationTriangle className="me-2 text-danger" />,
      count: upcomingExpiryDrivers.length,
    },
  ];

  return (
    <div className="premium-card bg-white p-4 border shadow-sm">
      {/* Tabs Header */}
      <div className="d-flex flex-wrap border-bottom pb-2 mb-4 justify-content-between align-items-center gap-3 no-print">
        <div className="d-flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm px-3 py-2 fw-semibold rounded-pill d-flex align-items-center transition-all ${
                activeTab === tab.id
                  ? 'btn-primary-gradient text-white shadow-sm'
                  : 'btn-light text-secondary hover-bg-light'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span className="badge bg-danger text-white ms-1.5 rounded-circle font-bold px-1.5" style={{ fontSize: '0.65rem' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="text-secondary small">Live Platform Logs</span>
      </div>

      {/* Tab Content */}
      <div className="table-responsive" style={{ minHeight: '260px' }}>
        {activeTab === 'trips' && (
          <table className="table table-custom align-middle mb-0">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th className="text-end">Cargo Weight</th>
                <th className="text-end">Planned Dist</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted small">No recent trips found.</td>
                </tr>
              ) : (
                trips.slice(0, 5).map((t, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">{t.tripNumber}</td>
                    <td>{t.source}</td>
                    <td>{t.destination}</td>
                    <td className="text-end fw-medium text-dark">
                      <FaWeightHanging size={10} className="me-1 text-muted" />
                      {t.cargoWeight} kg
                    </td>
                    <td className="text-end text-dark">{t.plannedDistance} km</td>
                    <td className="text-center">
                      <span className={`badge-status-${t.tripStatus.toLowerCase().replace(' ', '-')}`}>
                        {t.tripStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'fuel' && (
          <table className="table table-custom align-middle mb-0">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Fuel Station</th>
                <th className="text-end">Quantity</th>
                <th className="text-end">Cost</th>
                <th className="text-end">Odometer</th>
                <th className="text-center">Refuel Date</th>
              </tr>
            </thead>
            <tbody>
              {fuelLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted small">No fuel logs found.</td>
                </tr>
              ) : (
                fuelLogs.slice(0, 5).map((l, idx) => {
                  const reg = l.vehicle?.registrationNumber || l.vehicle || 'Unknown';
                  return (
                    <tr key={idx}>
                      <td className="fw-bold text-dark">{reg}</td>
                      <td>{l.fuelStation || 'Not Specified'}</td>
                      <td className="text-end text-dark">{l.fuelQuantity || l.quantity || 0} L</td>
                      <td className="text-end fw-bold text-success">${(l.fuelCost || l.cost || 0).toLocaleString()}</td>
                      <td className="text-end text-secondary">{ (l.odometerReading || l.odometer || 0).toLocaleString() } km</td>
                      <td className="text-center text-secondary small">
                        <FaCalendarAlt size={10} className="me-1" />
                        {new Date(l.fuelDate || l.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'maintenance' && (
          <table className="table table-custom align-middle mb-0">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Service Action</th>
                <th>Priority</th>
                <th className="text-end">Est Cost</th>
                <th className="text-center">Scheduled Date</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMaintenance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted small">No scheduled maintenance tasks found.</td>
                </tr>
              ) : (
                upcomingMaintenance.map((m, idx) => {
                  const reg = m.vehicle?.registrationNumber || m.vehicle || 'Unknown';
                  return (
                    <tr key={idx}>
                      <td className="fw-bold text-dark">{reg}</td>
                      <td>{m.serviceType || m.description || 'Routine Check'}</td>
                      <td className="text-center">
                        <span className={`badge bg-${m.priority === 'High' ? 'danger' : m.priority === 'Medium' ? 'warning' : 'info'} bg-opacity-10 text-${m.priority === 'High' ? 'danger' : m.priority === 'Medium' ? 'warning' : 'info'} px-2.5 py-1 rounded small fw-semibold`}>
                          {m.priority || 'Normal'}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-dark">${(m.cost || 0).toLocaleString()}</td>
                      <td className="text-center text-secondary small">
                        <FaCalendarAlt size={10} className="me-1" />
                        {new Date(m.maintenanceDate || m.date).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        <span className={`badge-status-${m.maintenanceStatus.toLowerCase().replace(' ', '-')}`}>
                          {m.maintenanceStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'alerts' && (
          <table className="table table-custom align-middle mb-0">
            <thead>
              <tr>
                <th>Driver</th>
                <th>License Number</th>
                <th className="text-center">Expiry Date</th>
                <th className="text-center">Status / Alert</th>
              </tr>
            </thead>
            <tbody>
              {upcomingExpiryDrivers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-success fw-semibold small">
                    <FaCheckCircle className="me-1.5" /> All driver licenses are fully valid with zero near-term expirations!
                  </td>
                </tr>
              ) : (
                upcomingExpiryDrivers.map((d, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">{d.fullName}</td>
                    <td>
                      <FaIdCard className="me-1.5 text-muted" />
                      {d.licenseNumber}
                    </td>
                    <td className="text-center text-secondary small">
                      {new Date(d.licenseExpiryDate).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      <span className={`badge bg-${d.daysLeft <= 30 ? 'danger' : 'warning'} bg-opacity-10 text-${d.daysLeft <= 30 ? 'danger' : 'warning'} px-3 py-1.5 rounded fw-bold small d-inline-flex align-items-center gap-1.5`}>
                        <FaExclamationTriangle size={10} />
                        {d.daysLeft <= 0 ? 'Expired!' : `Expiring in ${d.daysLeft} days`}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
