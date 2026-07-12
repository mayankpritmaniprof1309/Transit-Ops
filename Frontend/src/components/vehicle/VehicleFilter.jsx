import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

/**
 * Reusable Filter bar component for searching and categorizing vehicles.
 * @param {Object} props
 * @param {Object} props.filters - Current filter selections ({ search, status, type }).
 * @param {Function} props.onFilterChange - Callback when filters update.
 */
export const VehicleFilter = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      status: '',
      type: '',
    });
  };

  return (
    <div className="card-glass p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      {/* Search Input */}
      <div className="search-bar-container flex-grow-1" style={{ minWidth: '250px' }}>
        <FaSearch className="search-bar-icon" />
        <input
          type="text"
          name="search"
          className="search-bar-glass"
          placeholder="Search by registration or name..."
          value={filters.search || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* Filter Options */}
      <div className="d-flex flex-wrap align-items-center gap-3">
        {/* Status Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <FaFilter className="text-muted" style={{ fontSize: '0.85rem' }} />
          <select
            name="status"
            className="form-control-custom py-2 px-3 bg-white"
            style={{ width: '150px', border: '1px solid var(--border-light)' }}
            value={filters.status || ''}
            onChange={handleInputChange}
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        {/* Type Dropdown */}
        <select
          name="type"
          className="form-control-custom py-2 px-3 bg-white"
          style={{ width: '150px', border: '1px solid var(--border-light)' }}
          value={filters.type || ''}
          onChange={handleInputChange}
        >
          <option value="">All Types</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Mini Truck">Mini Truck</option>
          <option value="Pickup">Pickup</option>
          <option value="Trailer">Trailer</option>
          <option value="Other">Other</option>
        </select>

        {/* Reset Filters */}
        {(filters.search || filters.status || filters.type) && (
          <button
            onClick={handleReset}
            className="btn-custom btn-secondary-custom py-2 px-3"
            style={{ fontSize: '0.85rem' }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleFilter;
