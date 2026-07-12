import React from 'react';

export default function TopVehicles({ roiData = [], efficiencyData = [] }) {
  // Build a map of trip counts and fuel efficiencies per vehicle
  const vehicleStatsMap = {};
  efficiencyData.forEach((item) => {
    const reg = item.vehicle?.registrationNumber;
    if (reg) {
      if (!vehicleStatsMap[reg]) {
        vehicleStatsMap[reg] = { tripCount: 0, totalEfficiency: 0 };
      }
      vehicleStatsMap[reg].tripCount += 1;
      vehicleStatsMap[reg].totalEfficiency += item.fuelEfficiency || 0;
    }
  });

  // Merge statistics
  const mergedVehicles = roiData.map((item) => {
    const reg = item.registrationNumber;
    const stats = vehicleStatsMap[reg] || { tripCount: 0, totalEfficiency: 0 };
    const avgEfficiency = stats.tripCount > 0 ? (stats.totalEfficiency / stats.tripCount) : 0;
    return {
      registrationNumber: reg,
      vehicleName: item.vehicleName || 'Unknown',
      vehicleModel: item.vehicleModel || 'Unknown',
      revenue: item.revenue || 0,
      roi: (item.roi || 0) * 100, // Show as percentage
      trips: stats.tripCount,
      fuelEfficiency: avgEfficiency,
      // Status fallback
      status: item.acquisitionCost > 50000 ? 'Available' : 'On Trip',
    };
  }).sort((a, b) => b.roi - a.roi); // Sort by ROI descending

  return (
    <div className="premium-card bg-white p-4 border shadow-sm h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-1">Top Performing Vehicles</h5>
          <p className="text-secondary small mb-0">Highest ROI yielding vehicles rated by operating margin and trip revenue.</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-custom align-middle mb-0">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th className="text-center">Trips</th>
              <th className="text-end">Revenue</th>
              <th className="text-end">Fuel Efficiency</th>
              <th className="text-end">ROI</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {mergedVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted small">
                  No vehicles analytics available.
                </td>
              </tr>
            ) : (
              mergedVehicles.slice(0, 5).map((v, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-bold text-dark">{v.registrationNumber}</span>
                      <span className="text-secondary text-xsmall">{v.vehicleName} ({v.vehicleModel})</span>
                    </div>
                  </td>
                  <td className="text-center fw-medium text-dark">{v.trips}</td>
                  <td className="text-end fw-bold text-success">${v.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="text-end text-dark">{v.fuelEfficiency > 0 ? `${v.fuelEfficiency.toFixed(1)} km/L` : '—'}</td>
                  <td className="text-end fw-bold text-primary">{v.roi.toFixed(1)}%</td>
                  <td className="text-center">
                    <span className={`badge-status-${v.status.toLowerCase().replace(' ', '-')}`}>
                      {v.status}
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
