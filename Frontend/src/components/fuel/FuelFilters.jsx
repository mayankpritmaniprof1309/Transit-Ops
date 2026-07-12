import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaTimes } from 'react-icons/fa';

export default function FuelFilters({ onFilterChange, onReset }) {
  const [filters, setFilters] = useState({
    search: '',
    fuelType: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleClear = () => {
    const cleared = {
      search: '',
      fuelType: '',
      startDate: '',
      endDate: '',
    };
    setFilters(cleared);
    onReset(cleared);
  };

  const fuelTypes = ['Diesel', 'Gasoline', 'Electric', 'Hybrid', 'CNG'];

  return (
    <div className="premium-card bg-white p-4 mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaFilter className="text-primary" />
        <h6 className="fw-bold mb-0 text-dark">Refueling Search & Filters</h6>
      </div>

      <div className="row g-3">
        {/* Search */}
        <div className="col-12 col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              name="search"
              className="form-control bg-light border-light"
              placeholder="Search by vehicle registration plate..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Fuel Type */}
        <div className="col-12 col-sm-4 col-md-3">
          <select
            name="fuelType"
            className="form-select bg-light border-light"
            value={filters.fuelType}
            onChange={handleChange}
          >
            <option value="">All Fuel Types</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaCalendarAlt size={13} />
            </span>
            <input
              type="date"
              name="startDate"
              className="form-control bg-light border-light"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaCalendarAlt size={13} />
            </span>
            <input
              type="date"
              name="endDate"
              className="form-control bg-light border-light"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {(filters.search || filters.fuelType || filters.startDate || filters.endDate) && (
        <div className="mt-3 pt-2 d-flex justify-content-end border-top border-light">
          <button
            onClick={handleClear}
            className="btn btn-premium-secondary btn-sm d-flex align-items-center gap-1 text-danger border-danger border-opacity-25"
          >
            <FaTimes size={12} /> Reset Fuel Filters
          </button>
        </div>
      )}
    </div>
  );
}
