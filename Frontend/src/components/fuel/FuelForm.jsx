import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Form component to create or update Fuel logs.
 * @param {Object} props
 * @param {Object} props.fuelLog - Initial fuel log details if editing.
 * @param {Array} props.vehicles - List of vehicles to populate dropdown.
 * @param {Array} props.trips - List of trips to populate dropdown (optional).
 * @param {Function} props.onSubmit - Triggered on form submit with form data.
 * @param {Function} props.onCancel - Triggered on cancel action.
 * @param {boolean} props.isSubmitting - Toggle loading state for buttons.
 */
export const FuelForm = ({
  fuelLog = null,
  vehicles = [],
  trips = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    vehicle: '',
    trip: '',
    fuelQuantity: '',
    fuelCost: '',
    fuelStation: '',
    fuelDate: '',
    odometerReading: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (fuelLog) {
      const formattedDate = fuelLog.fuelDate
        ? new Date(fuelLog.fuelDate).toISOString().split('T')[0]
        : '';

      setFormData({
        vehicle: fuelLog.vehicle?._id || fuelLog.vehicle || '',
        trip: fuelLog.trip?._id || fuelLog.trip || '',
        fuelQuantity: fuelLog.fuelQuantity || '',
        fuelCost: fuelLog.fuelCost || '',
        fuelStation: fuelLog.fuelStation || '',
        fuelDate: formattedDate,
        odometerReading: fuelLog.odometerReading || '',
        remarks: fuelLog.remarks || '',
      });
    } else {
      // Default to today's date
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        vehicle: vehicles[0]?._id || '',
        trip: '',
        fuelQuantity: '',
        fuelCost: '',
        fuelStation: '',
        fuelDate: today,
        odometerReading: '',
        remarks: '',
      });
    }
    setErrors({});
  }, [fuelLog, vehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'fuelQuantity' || name === 'fuelCost' || name === 'odometerReading'
        ? (value === '' ? '' : Number(value))
        : value,
    }));

    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicle) {
      newErrors.vehicle = 'Vehicle selection is required';
    }

    if (!formData.fuelQuantity || Number(formData.fuelQuantity) <= 0) {
      newErrors.fuelQuantity = 'Fuel quantity must be greater than 0';
    }

    if (!formData.fuelCost || Number(formData.fuelCost) <= 0) {
      newErrors.fuelCost = 'Fuel cost must be greater than 0';
    }

    if (!formData.fuelDate) {
      newErrors.fuelDate = 'Fuel entry date is required';
    }

    if (!formData.odometerReading || Number(formData.odometerReading) < 0) {
      newErrors.odometerReading = 'Odometer reading cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="card-solid"
      noValidate
    >
      <h3 className="mb-4">{fuelLog ? 'Edit Fuel Purchase Details' : 'Record Fuel Purchase'}</h3>

      <div className="row">
        {/* Vehicle Selection */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="vehicle">
            Vehicle Reference
          </label>
          <select
            id="vehicle"
            name="vehicle"
            className={`form-control-custom ${errors.vehicle ? 'is-invalid' : ''}`}
            value={formData.vehicle}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.vehicleName} ({v.registrationNumber})
              </option>
            ))}
          </select>
          {errors.vehicle && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.vehicle}</div>
          )}
        </div>

        {/* Trip Selection */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="trip">
            Associated Trip (Optional)
          </label>
          <select
            id="trip"
            name="trip"
            className="form-control-custom"
            value={formData.trip}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">-- None / Offline Run --</option>
            {trips.map((t) => (
              <option key={t._id} value={t._id}>
                {t.tripNumber || t.tripCode || t._id}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Quantity */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="fuelQuantity">
            Fuel Quantity (Liters)
          </label>
          <input
            type="number"
            id="fuelQuantity"
            name="fuelQuantity"
            step="0.01"
            className={`form-control-custom ${errors.fuelQuantity ? 'is-invalid' : ''}`}
            placeholder="e.g. 50.45"
            value={formData.fuelQuantity}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.fuelQuantity && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.fuelQuantity}</div>
          )}
        </div>

        {/* Total Cost */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="fuelCost">
            Total Purchase Cost ($)
          </label>
          <input
            type="number"
            id="fuelCost"
            name="fuelCost"
            step="0.01"
            className={`form-control-custom ${errors.fuelCost ? 'is-invalid' : ''}`}
            placeholder="e.g. 75.50"
            value={formData.fuelCost}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.fuelCost && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.fuelCost}</div>
          )}
        </div>

        {/* Odometer Reading */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="odometerReading">
            Odometer Reading (km)
          </label>
          <input
            type="number"
            id="odometerReading"
            name="odometerReading"
            className={`form-control-custom ${errors.odometerReading ? 'is-invalid' : ''}`}
            placeholder="e.g. 24800"
            value={formData.odometerReading}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.odometerReading && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.odometerReading}</div>
          )}
        </div>

        {/* Fuel Date */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="fuelDate">
            Purchase Date
          </label>
          <input
            type="date"
            id="fuelDate"
            name="fuelDate"
            className={`form-control-custom ${errors.fuelDate ? 'is-invalid' : ''}`}
            value={formData.fuelDate}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.fuelDate && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.fuelDate}</div>
          )}
        </div>

        {/* Fuel Station */}
        <div className="col-12 form-group-custom">
          <label className="form-label-custom" htmlFor="fuelStation">
            Fuel Station / Vendor Name
          </label>
          <input
            type="text"
            id="fuelStation"
            name="fuelStation"
            className="form-control-custom"
            placeholder="e.g. Shell Station #45, West Highway"
            value={formData.fuelStation}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Remarks */}
        <div className="col-12 form-group-custom">
          <label className="form-label-custom" htmlFor="remarks">
            Remarks & Notes
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows="2"
            className="form-control-custom"
            placeholder="Add any receipt details, notes, or fuel card details..."
            value={formData.remarks}
            onChange={handleChange}
            disabled={isSubmitting}
            style={{ resize: 'none' }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-custom btn-secondary-custom"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-custom btn-primary-gradient"
        >
          {isSubmitting ? 'Recording...' : fuelLog ? 'Save Updates' : 'Add Fuel Log'}
        </button>
      </div>
    </motion.form>
  );
};

export default FuelForm;
