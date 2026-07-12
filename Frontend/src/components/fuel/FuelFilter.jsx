import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

/**
 * Filter bar panel component for Fuel logs.
 * @param {Object} props
 * @param {string} props.searchVal - Current search query text.
 * @param {Function} props.onSearchChange - Action triggered when typing search query.
 * @param {string} props.selectedVehicle - Current selected filter vehicle.
 * @param {Function} props.onVehicleChange - Action triggered when filter vehicle changes.
 * @param {Array} props.vehicles - Array of vehicle details.
 * @param {string} props.dateFrom - Start date filter.
 * @param {Function} props.onDateFromChange - Action triggered when start date changes.
 * @param {string} props.dateTo - End date filter.
 * @param {Function} props.onDateToChange - Action triggered when end date changes.
 * @param {Function} props.onClearFilters - Action triggered when clicking clear.
 */
export const FuelFilter = ({
  searchVal,
  onSearchChange,
  selectedVehicle,
  onVehicleChange,
  vehicles = [],
  dateFrom = '',
  onDateFromChange,
  dateTo = '',
  onDateToChange,
  onClearFilters,
}) => {
  const hasFilters = searchVal || selectedVehicle || dateFrom || dateTo;

  return (
    <div className="glass-navbar border rounded-3 p-3 mb-4">
      <div className="d-flex flex-wrap align-items-center gap-3">
        {/* Search Input */}
        <div className="search-bar-container flex-grow-1" style={{ maxWidth: '280px', minWidth: '180px' }}>
          <FaSearch className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-glass"
            placeholder="Search station or remarks..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Vehicle Filter */}
        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted" style={{ fontSize: '0.75rem' }} />
          <select
            className="form-control-custom py-2"
            style={{ minWidth: '140px', borderRadius: '10px', fontSize: '0.85rem' }}
            value={selectedVehicle}
            onChange={(e) => onVehicleChange(e.target.value)}
          >
            <option value="">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber || v.vehicleName}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        {onDateFromChange && (
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted fw-semibold mb-0" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>From:</label>
            <input
              type="date"
              className="form-control-custom py-2"
              style={{ minWidth: '140px', borderRadius: '10px', fontSize: '0.85rem' }}
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>
        )}

        {/* Date To */}
        {onDateToChange && (
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted fw-semibold mb-0" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>To:</label>
            <input
              type="date"
              className="form-control-custom py-2"
              style={{ minWidth: '140px', borderRadius: '10px', fontSize: '0.85rem' }}
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
        )}

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

export default FuelFilter;
