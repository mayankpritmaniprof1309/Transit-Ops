import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaTimes, FaCar } from 'react-icons/fa';
import { getAllVehicles } from '../../services/vehicle.service.js';

export default function FuelFilters({ onFilterChange, onReset }) {
  const [filters, setFilters] = useState({
    search: '',
    vehicle: '',
    startDate: '',
    endDate: '',
  });

  const [vehicles, setVehicles] = useState([]);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);

  // Fetch vehicles for dropdown on mount
  useEffect(() => {
    const loadVehicles = async () => {
      setFetchingVehicles(true);
      try {
        const res = await getAllVehicles({ limit: 100 });
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.vehicles || []);
          setVehicles(list);
        }
      } catch (err) {
        console.error('Failed to load filter vehicles list:', err);
      } finally {
        setFetchingVehicles(false);
      }
    };
    loadVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleClear = () => {
    const cleared = {
      search: '',
      vehicle: '',
      startDate: '',
      endDate: '',
    };
    setFilters(cleared);
    onReset(cleared);
  };

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

        {/* Vehicle Filter */}
        <div className="col-12 col-sm-4 col-md-3">
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaCar size={14} />
            </span>
            <select
              name="vehicle"
              className="form-select bg-light border-light"
              value={filters.vehicle}
              onChange={handleChange}
              disabled={fetchingVehicles}
            >
              <option value="">All Vehicles</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} - {v.vehicleName}
                </option>
              ))}
            </select>
          </div>
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

      {(filters.search || filters.vehicle || filters.startDate || filters.endDate) && (
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
