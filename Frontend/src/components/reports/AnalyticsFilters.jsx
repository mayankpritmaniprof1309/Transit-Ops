import React, { useState, useEffect } from 'react';
import { FaFilter, FaCalendarAlt, FaCar, FaUser, FaRoute, FaGlobe, FaCogs, FaGasPump, FaTimes, FaSearch } from 'react-icons/fa';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { getAllDrivers } from '../../services/driver.service.js';

export default function AnalyticsFilters({ onApplyFilters, onResetFilters }) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    vehicleId: '',
    driverId: '',
    tripStatus: '',
    region: '',
    vehicleType: '',
    fuelType: '',
  });

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Fetch dropdown data on mount
  useEffect(() => {
    getAllVehicles({ limit: 100 })
      .then((res) => {
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.vehicles || []);
          setVehicles(list);
        }
      })
      .catch(() => {});

    getAllDrivers({ limit: 100 })
      .then((res) => {
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.drivers || []);
          setDrivers(list);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const cleared = {
      startDate: '',
      endDate: '',
      vehicleId: '',
      driverId: '',
      tripStatus: '',
      region: '',
      vehicleType: '',
      fuelType: '',
    };
    setFilters(cleared);
    onResetFilters(cleared);
  };

  return (
    <form onSubmit={handleApply} className="glass-navbar border rounded-4 p-4 mb-4 text-dark shadow-sm no-print">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaFilter className="text-primary" />
        <h6 className="fw-bold mb-0 text-dark">Executive Filters</h6>
      </div>

      <div className="row g-3">
        {/* Date From */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">Start Date</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaCalendarAlt size={13} />
            </span>
            <input
              type="date"
              name="startDate"
              className="form-control bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Date To */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">End Date</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaCalendarAlt size={13} />
            </span>
            <input
              type="date"
              name="endDate"
              className="form-control bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Vehicle */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">Vehicle</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaCar size={13} />
            </span>
            <select
              name="vehicleId"
              className="form-select bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.vehicleId}
              onChange={handleChange}
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

        {/* Driver */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">Driver</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaUser size={13} />
            </span>
            <select
              name="driverId"
              className="form-select bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.driverId}
              onChange={handleChange}
            >
              <option value="">All Drivers</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trip Status */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">Trip Status</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaRoute size={13} />
            </span>
            <select
              name="tripStatus"
              className="form-select bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.tripStatus}
              onChange={handleChange}
            >
              <option value="">All Trip Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Region */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">Region</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaGlobe size={13} />
            </span>
            <select
              name="region"
              className="form-select bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.region}
              onChange={handleChange}
            >
              <option value="">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="Central">Central</option>
            </select>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">Vehicle Type</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaCogs size={13} />
            </span>
            <select
              name="vehicleType"
              className="form-select bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.vehicleType}
              onChange={handleChange}
            >
              <option value="">All Vehicle Types</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Pickup">Pickup</option>
              <option value="Trailer">Trailer</option>
              <option value="Car">Car</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Fuel Type */}
        <div className="col-12 col-sm-6 col-md-3">
          <label className="text-secondary small mb-1 fw-semibold d-block">Fuel Type</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-light text-muted">
              <FaGasPump size={13} />
            </span>
            <select
              name="fuelType"
              className="form-select bg-light border-light py-2"
              style={{ fontSize: '0.85rem' }}
              value={filters.fuelType}
              onChange={handleChange}
            >
              <option value="">All Fuel Types</option>
              <option value="Diesel">Diesel</option>
              <option value="Gasoline">Gasoline</option>
              <option value="CNG">CNG</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-light border-opacity-50">
        <button
          type="button"
          onClick={handleReset}
          className="btn-custom btn-secondary-custom py-2 px-4"
          style={{ fontSize: '0.85rem' }}
        >
          Reset Filters
        </button>
        <button
          type="submit"
          className="btn-custom btn-primary-gradient py-2 px-4 text-white"
          style={{ fontSize: '0.85rem' }}
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
