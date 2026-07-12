import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

/**
 * Filter bar panel component for Fuel logs.
 * @param {Object} props
 * @param {string} props.searchVal - Current search query text.
 * @param {Function} props.onSearchChange - Action triggered when typing search query.
 * @param {string} props.selectedVehicle - Current selected filter vehicle.
 * @param {Function} props.onVehicleChange - Action triggered when filter vehicle changes.
 * @param {Array} props.vehicles - Array of vehicle details to list in option selection.
 * @param {Function} props.onClearFilters - Action triggered when clicking clear.
 */
export const FuelFilter = ({
  searchVal,
  onSearchChange,
  selectedVehicle,
  onVehicleChange,
  vehicles = [],
  onClearFilters,
}) => {
  return (
    <div className="glass-navbar border rounded-3 p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div className="d-flex align-items-center gap-3 flex-grow-1 flex-sm-nowrap">
        {/* Search Input (Glass style) */}
        <div className="search-bar-container flex-grow-1" style={{ maxWidth: '350px' }}>
          <FaSearch className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-glass"
            placeholder="Search station or remarks..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Vehicle Filter Dropdown (Glass style) */}
        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted text-small" />
          <select
            className="form-select border-0 text-small fw-semibold bg-light text-dark shadow-sm"
            style={{ borderRadius: '12px', padding: '0.6rem 2.2rem 0.6rem 1.2rem', cursor: 'pointer' }}
            value={selectedVehicle}
            onChange={(e) => onVehicleChange(e.target.value)}
          >
            <option value="">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(searchVal || selectedVehicle) && (
        <button
          onClick={onClearFilters}
          className="btn btn-link text-small text-decoration-none text-muted p-0"
          style={{ cursor: 'pointer' }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FuelFilter;
