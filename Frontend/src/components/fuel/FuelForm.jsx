import React, { useState, useEffect } from 'react';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { FaTruck, FaGasPump, FaDollarSign, FaCalendarAlt, FaRoad, FaMapMarkerAlt } from 'react-icons/fa';

export default function FuelForm({ log, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    vehicle: '',
    quantity: '',
    pricePerUnit: '',
    cost: '',
    odometer: '',
    fuelStation: '',
    date: '',
  });

  const [vehicles, setVehicles] = useState([]);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Fetch vehicles dropdown
  useEffect(() => {
    const loadVehicles = async () => {
      setFetchingVehicles(true);
      try {
        const vehRes = await getAllVehicles({ limit: 100 });
        let list = [];
        if (vehRes.success && vehRes.data) {
          list = Array.isArray(vehRes.data) ? vehRes.data : (vehRes.data.vehicles || []);
        }
        setVehicles(list);
      } catch (err) {
        console.error('Failed to load vehicles list.', err);
      } finally {
        setFetchingVehicles(false);
      }
    };
    loadVehicles();
  }, []);

  // Populate when editing
  useEffect(() => {
    if (log) {
      setFormData({
        vehicle: log.vehicle?._id || log.vehicle || '',
        quantity: log.quantity || '',
        pricePerUnit: log.pricePerUnit || '',
        cost: log.cost || '',
        odometer: log.odometer || '',
        fuelStation: log.fuelStation || '',
        date: log.date ? new Date(log.date).toISOString().substring(0, 10) : '',
      });
    }
  }, [log]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculations logic:
      const qty = parseFloat(updated.quantity);
      const prc = parseFloat(updated.pricePerUnit);
      const cst = parseFloat(updated.cost);

      if (name === 'quantity' && !isNaN(qty) && qty > 0) {
        if (!isNaN(cst)) {
          updated.pricePerUnit = (cst / qty).toFixed(2);
        } else if (!isNaN(prc)) {
          updated.cost = (qty * prc).toFixed(2);
        }
      } else if (name === 'cost' && !isNaN(cst) && cst > 0) {
        if (!isNaN(qty) && qty > 0) {
          updated.pricePerUnit = (cst / qty).toFixed(2);
        } else if (!isNaN(prc) && prc > 0) {
          updated.quantity = (cst / prc).toFixed(2);
        }
      } else if (name === 'pricePerUnit' && !isNaN(prc) && prc > 0) {
        if (!isNaN(qty) && qty > 0) {
          updated.cost = (qty * prc).toFixed(2);
        } else if (!isNaN(cst) && cst > 0) {
          updated.quantity = (cst / prc).toFixed(2);
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.vehicle) {
      setValidationError('Please select a vehicle.');
      return;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setValidationError('Please enter a valid quantity.');
      return;
    }
    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      setValidationError('Please enter a valid total cost.');
      return;
    }
    if (!formData.date) {
      setValidationError('Please select a date.');
      return;
    }

    onSave({
      ...formData,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0,
      cost: parseFloat(formData.cost),
      odometer: formData.odometer ? parseInt(formData.odometer, 10) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {validationError && (
        <div className="alert alert-danger py-2 px-3 border-0 rounded-3 mb-3 small">
          {validationError}
        </div>
      )}

      <div className="row g-3">
        {/* Vehicle */}
        <div className="col-12 col-md-6">
          <div className="form-floating">
            <select
              id="formVehicle"
              name="vehicle"
              className="form-select bg-light border-light"
              value={formData.vehicle}
              onChange={handleChange}
              disabled={loading || fetchingVehicles}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} - {v.make} {v.model}
                </option>
              ))}
            </select>
            <label htmlFor="formVehicle">
              <FaTruck className="me-2 text-muted" /> Select Vehicle
            </label>
          </div>
        </div>

        {/* Odometer */}
        <div className="col-12 col-md-6">
          <div className="form-floating">
            <input
              type="number"
              id="formOdometer"
              name="odometer"
              className="form-control bg-light border-light"
              placeholder="1000"
              value={formData.odometer}
              onChange={handleChange}
              disabled={loading}
              min="0"
            />
            <label htmlFor="formOdometer">
              <FaRoad className="me-2 text-muted" /> Odometer (km)
            </label>
          </div>
        </div>

        {/* Quantity (Liters) */}
        <div className="col-12 col-sm-4">
          <div className="form-floating">
            <input
              type="number"
              id="formQuantity"
              name="quantity"
              className="form-control bg-light border-light"
              placeholder="50"
              value={formData.quantity}
              onChange={handleChange}
              disabled={loading}
              min="0.1"
              step="0.1"
              required
            />
            <label htmlFor="formQuantity">
              <FaGasPump className="me-2 text-muted" /> Liters Filled
            </label>
          </div>
        </div>

        {/* Unit Price per Liter */}
        <div className="col-12 col-sm-4">
          <div className="form-floating">
            <input
              type="number"
              id="formPricePerUnit"
              name="pricePerUnit"
              className="form-control bg-light border-light"
              placeholder="1.5"
              value={formData.pricePerUnit}
              onChange={handleChange}
              disabled={loading}
              min="0.01"
              step="0.01"
              required
            />
            <label htmlFor="formPricePerUnit">Price per Liter ($)</label>
          </div>
        </div>

        {/* Total Cost */}
        <div className="col-12 col-sm-4">
          <div className="form-floating">
            <input
              type="number"
              id="formCost"
              name="cost"
              className="form-control bg-light border-light"
              placeholder="75"
              value={formData.cost}
              onChange={handleChange}
              disabled={loading}
              min="0.1"
              step="0.1"
              required
            />
            <label htmlFor="formCost">
              <FaDollarSign className="me-2 text-muted" /> Total Cost ($)
            </label>
          </div>
        </div>

        {/* Date */}
        <div className="col-12 col-sm-6">
          <div className="form-floating">
            <input
              type="date"
              id="formDate"
              name="date"
              className="form-control bg-light border-light"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <label htmlFor="formDate">
              <FaCalendarAlt className="me-2 text-muted" /> Refueling Date
            </label>
          </div>
        </div>

        {/* Fuel Station */}
        <div className="col-12 col-sm-6">
          <div className="form-floating">
            <input
              type="text"
              id="formStation"
              name="fuelStation"
              className="form-control bg-light border-light"
              placeholder="Station Name"
              value={formData.fuelStation}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="formStation">
              <FaMapMarkerAlt className="me-2 text-muted" /> Fuel Station Location
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-premium-secondary px-4"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-premium-primary px-4"
          disabled={loading}
        >
          {loading ? 'Processing...' : log ? 'Update Log' : 'Save Log'}
        </button>
      </div>
    </form>
  );
}
