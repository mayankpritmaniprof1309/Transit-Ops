import React from 'react';
import { FaEdit, FaTrashAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function FuelTable({
  logs = [],
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

  const handleSort = (field) => {
    if (onSortChange) {
      onSortChange(field);
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'desc' ? <FaArrowDown className="ms-1" size={10} /> : <FaArrowUp className="ms-1" size={10} />;
  };

  return (
    <div className="premium-card bg-white p-0 border overflow-hidden">
      <div className="table-responsive">
        <table className="table premium-table align-middle mb-0">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                Refuel Date {renderSortIcon('date')}
              </th>
              <th>Vehicle</th>
              <th className="text-end">Liters Filled</th>
              <th className="text-end">Price / Liter</th>
              <th className="cursor-pointer text-end" onClick={() => handleSort('cost')} style={{ cursor: 'pointer' }}>
                Total Cost {renderSortIcon('cost')}
              </th>
              <th className="text-end">Odometer</th>
              <th>Fuel Station</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-secondary">
                  No refueling logs recorded. Try modifying filters or recording a new log.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const vehicleReg = log.vehicle?.registrationNumber || 'N/A';
                return (
                  <tr key={log._id}>
                    <td className="fw-medium text-dark">
                      {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="fw-bold text-secondary">{vehicleReg}</td>
                    <td className="text-end text-dark fw-medium">{(log.quantity || 0).toFixed(1)} L</td>
                    <td className="text-end text-secondary">{formatCurrency(log.pricePerUnit)}/L</td>
                    <td className="text-end fw-bold text-dark">{formatCurrency(log.cost)}</td>
                    <td className="text-end text-secondary">
                      {log.odometer ? `${log.odometer.toLocaleString()} km` : 'N/A'}
                    </td>
                    <td className="small text-secondary">{log.fuelStation || 'N/A'}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => onEdit(log)}
                          className="btn btn-sm btn-premium-secondary p-2.5 rounded-3"
                          title="Edit Log"
                        >
                          <FaEdit size={14} className="text-primary" />
                        </button>
                        <button
                          onClick={() => onDelete(log._id)}
                          className="btn btn-sm btn-premium-secondary p-2.5 rounded-3 text-danger border-danger border-opacity-10"
                          title="Delete Log"
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
