import React, { useEffect, useState } from 'react';
import { getAllDrivers } from '../../services/driver.service.js';

export default function DriverPerformanceTable({ efficiencyData = [] }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllDrivers({ limit: 100 })
      .then((res) => {
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.drivers || []);
          setDrivers(list);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Map driver stats based on completed trips
  const driverStatsMap = {};
  efficiencyData.forEach((item) => {
    const driverId = item.driver?._id || item.driver?.id;
    if (driverId) {
      if (!driverStatsMap[driverId]) {
        driverStatsMap[driverId] = { tripCount: 0, totalEfficiency: 0 };
      }
      driverStatsMap[driverId].tripCount += 1;
      driverStatsMap[driverId].totalEfficiency += item.fuelEfficiency || 0;
    }
  });

  const driverPerformance = drivers.map((d) => {
    const stats = driverStatsMap[d._id] || { tripCount: 0, totalEfficiency: 0 };
    const avgEfficiency = stats.tripCount > 0 ? (stats.totalEfficiency / stats.tripCount) : 0;
    return {
      name: d.fullName || 'Unknown Driver',
      tripsCompleted: stats.tripCount,
      safetyScore: d.safetyScore ?? 100,
      fuelEfficiency: avgEfficiency,
      status: d.status || 'Available',
    };
  }).sort((a, b) => b.safetyScore - a.safetyScore); // Sort by safety score

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-1">Driver Performance</h5>
          <p className="text-secondary small mb-0">Safety rating and fleet operation metrics for enrolled drivers.</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-custom align-middle mb-0">
          <thead>
            <tr>
              <th>Driver</th>
              <th className="text-center">Trips Completed</th>
              <th className="text-center">Safety Score</th>
              <th className="text-end">Avg Efficiency</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status" />
                </td>
              </tr>
            ) : driverPerformance.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted small">
                  No driver performance metrics available.
                </td>
              </tr>
            ) : (
              driverPerformance.slice(0, 5).map((d, idx) => (
                <tr key={idx}>
                  <td className="fw-bold text-dark">{d.name}</td>
                  <td className="text-center fw-medium text-dark">{d.tripsCompleted}</td>
                  <td className="text-center">
                    <span className={`badge bg-${d.safetyScore >= 90 ? 'success' : d.safetyScore >= 75 ? 'warning' : 'danger'} bg-opacity-10 text-${d.safetyScore >= 90 ? 'success' : d.safetyScore >= 75 ? 'warning' : 'danger'} rounded px-2.5 py-1 fw-bold small`}>
                      {d.safetyScore}/100
                    </span>
                  </td>
                  <td className="text-end text-dark">{d.fuelEfficiency > 0 ? `${d.fuelEfficiency.toFixed(1)} km/L` : '—'}</td>
                  <td className="text-center">
                    <span className={`badge-status-${d.status.toLowerCase().replace(' ', '-')}`}>
                      {d.status}
                    </span>
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
