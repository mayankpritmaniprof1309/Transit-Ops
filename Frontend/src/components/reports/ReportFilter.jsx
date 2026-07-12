import React from 'react';
import { FaFilter, FaTimes, FaCalendarAlt } from 'react-icons/fa';

/**
 * Reusable Report filter bar component.
 * @param {Object} props
 * @param {string} props.dateFrom - Start date filter value.
 * @param {Function} props.onDateFromChange - Handler for start date change.
 * @param {string} props.dateTo - End date filter value.
 * @param {Function} props.onDateToChange - Handler for end date change.
 * @param {string} props.selectedVehicle - Currently selected vehicle ID.
 * @param {Function} props.onVehicleChange - Handler for vehicle change.
 * @param {Array} props.vehicles - Vehicle list for dropdown.
 * @param {string} props.selectedType - Report type filter ('all' | 'expenses' | 'fuel').
 * @param {Function} props.onTypeChange - Handler for type change.
 * @param {Function} props.onClearFilters - Handler to reset all filters.
 */
export const ReportFilter = ({
  dateFrom = '',
  onDateFromChange,
  dateTo = '',
  onDateToChange,
  selectedVehicle = '',
  onVehicleChange,
  vehicles = [],
  selectedType = 'all',
  onTypeChange,
  onClearFilters,
}) => {
  const hasFilters = dateFrom || dateTo || selectedVehicle || (selectedType && selectedType !== 'all');

  return (
    <div className="glass-navbar border rounded-3 p-3 mb-4">
      <div className="d-flex flex-wrap align-items-center gap-3">
        {/* Report Type */}
        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted" style={{ fontSize: '0.75rem' }} />
          <select
            className="form-control-custom py-2"
            style={{ minWidth: '160px', borderRadius: '10px', fontSize: '0.85rem' }}
            value={selectedType}
            onChange={(e) => onTypeChange && onTypeChange(e.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="expenses">Expenses Only</option>
            <option value="fuel">Fuel Only</option>
          </select>
        </div>

        {/* Vehicle Filter */}
        {vehicles.length > 0 && (
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-control-custom py-2"
              style={{ minWidth: '150px', borderRadius: '10px', fontSize: '0.85rem' }}
              value={selectedVehicle}
              onChange={(e) => onVehicleChange && onVehicleChange(e.target.value)}
            >
              <option value="">All Vehicles</option>
              {vehicles.map((v, index) => (
                <option key={v._id || v.id || `veh-${index}`} value={v._id || v.id || ''}>
                  {v.registrationNumber || v.vehicleName || 'Unknown Vehicle'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date From */}
        <div className="d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-muted" style={{ fontSize: '0.8rem' }} />
          <label className="text-muted fw-semibold mb-0" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>From:</label>
          <input
            type="date"
            className="form-control-custom py-2"
            style={{ minWidth: '140px', borderRadius: '10px', fontSize: '0.85rem' }}
            value={dateFrom}
            onChange={(e) => onDateFromChange && onDateFromChange(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="d-flex align-items-center gap-2">
          <label className="text-muted fw-semibold mb-0" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>To:</label>
          <input
            type="date"
            className="form-control-custom py-2"
            style={{ minWidth: '140px', borderRadius: '10px', fontSize: '0.85rem' }}
            value={dateTo}
            onChange={(e) => onDateToChange && onDateToChange(e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="btn-custom btn-secondary-custom py-2 px-3 d-flex align-items-center gap-2"
            style={{ fontSize: '0.82rem', borderRadius: '10px' }}
          >
            <FaTimes size={10} /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportFilter;
