import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Form component to create or update Vehicles.
 * @param {Object} props
 * @param {Object} props.vehicle - Initial vehicle data if editing.
 * @param {Function} props.onSubmit - Triggered on form submit with form data.
 * @param {Function} props.onCancel - Triggered on cancel action.
 * @param {boolean} props.isSubmitting - Toggle loading state for buttons.
 */
export const VehicleForm = ({ vehicle = null, onSubmit, onCancel, isSubmitting = false }) => {
  // Define initial form states
  const [formData, setFormData] = useState({
    registrationNumber: '',
    vehicleName: '',
    vehicleModel: '',
    vehicleType: 'Truck',
    maximumLoadCapacity: '',
    odometer: 0,
    acquisitionCost: '',
    status: 'Available',
    region: '',
  });

  const [errors, setErrors] = useState({});

  // Sync initial data if vehicle prop changes (e.g. edit mode opens)
  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber || '',
        vehicleName: vehicle.vehicleName || '',
        vehicleModel: vehicle.vehicleModel || '',
        vehicleType: vehicle.vehicleType || 'Truck',
        maximumLoadCapacity: vehicle.maximumLoadCapacity || '',
        odometer: vehicle.odometer || 0,
        acquisitionCost: vehicle.acquisitionCost || '',
        status: vehicle.status || 'Available',
        region: vehicle.region || '',
      });
    } else {
      setFormData({
        registrationNumber: '',
        vehicleName: '',
        vehicleModel: '',
        vehicleType: 'Truck',
        maximumLoadCapacity: '',
        odometer: 0,
        acquisitionCost: '',
        status: 'Available',
        region: '',
      });
    }
    setErrors({});
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maximumLoadCapacity' || name === 'odometer' || name === 'acquisitionCost'
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

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    } else if (formData.registrationNumber.length < 5 || formData.registrationNumber.length > 20) {
      newErrors.registrationNumber = 'Must be between 5 and 20 characters';
    }

    if (!formData.vehicleName.trim()) {
      newErrors.vehicleName = 'Vehicle name is required';
    } else if (formData.vehicleName.length < 2) {
      newErrors.vehicleName = 'Must be at least 2 characters';
    }

    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Vehicle model is required';
    }

    if (!formData.maximumLoadCapacity || Number(formData.maximumLoadCapacity) <= 0) {
      newErrors.maximumLoadCapacity = 'Load capacity must be greater than 0';
    }

    if (formData.odometer < 0) {
      newErrors.odometer = 'Odometer cannot be negative';
    }

    if (!formData.acquisitionCost || Number(formData.acquisitionCost) <= 0) {
      newErrors.acquisitionCost = 'Acquisition cost must be positive';
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
      <h3 className="mb-4">{vehicle ? 'Update Fleet Vehicle' : 'Register New Vehicle'}</h3>

      <div className="row">
        {/* Registration Number */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="registrationNumber">
            Registration Number
          </label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            className={`form-control-custom ${errors.registrationNumber ? 'is-invalid' : ''}`}
            placeholder="e.g. MH12AB1234"
            value={formData.registrationNumber}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.registrationNumber && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.registrationNumber}
            </div>
          )}
        </div>

        {/* Vehicle Name */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="vehicleName">
            Vehicle Name
          </label>
          <input
            type="text"
            id="vehicleName"
            name="vehicleName"
            className={`form-control-custom ${errors.vehicleName ? 'is-invalid' : ''}`}
            placeholder="e.g. Cargo Giant"
            value={formData.vehicleName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.vehicleName && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.vehicleName}
            </div>
          )}
        </div>

        {/* Vehicle Model */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="vehicleModel">
            Model Spec
          </label>
          <input
            type="text"
            id="vehicleModel"
            name="vehicleModel"
            className={`form-control-custom ${errors.vehicleModel ? 'is-invalid' : ''}`}
            placeholder="e.g. TATA Prima 5530.S"
            value={formData.vehicleModel}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.vehicleModel && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.vehicleModel}
            </div>
          )}
        </div>

        {/* Vehicle Type */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="vehicleType">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            className="form-control-custom"
            value={formData.vehicleType}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Pickup">Pickup</option>
            <option value="Trailer">Trailer</option>
            <option value="Car">Car</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Maximum Load Capacity */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="maximumLoadCapacity">
            Max Load Capacity (kg)
          </label>
          <input
            type="number"
            id="maximumLoadCapacity"
            name="maximumLoadCapacity"
            className={`form-control-custom ${errors.maximumLoadCapacity ? 'is-invalid' : ''}`}
            placeholder="e.g. 15000"
            value={formData.maximumLoadCapacity}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.maximumLoadCapacity && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.maximumLoadCapacity}
            </div>
          )}
        </div>

        {/* Odometer */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="odometer">
            Current Odometer (km)
          </label>
          <input
            type="number"
            id="odometer"
            name="odometer"
            className={`form-control-custom ${errors.odometer ? 'is-invalid' : ''}`}
            placeholder="e.g. 12500"
            value={formData.odometer}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.odometer && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.odometer}
            </div>
          )}
        </div>

        {/* Acquisition Cost */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="acquisitionCost">
            Acquisition Cost ($)
          </label>
          <input
            type="number"
            id="acquisitionCost"
            name="acquisitionCost"
            className={`form-control-custom ${errors.acquisitionCost ? 'is-invalid' : ''}`}
            placeholder="e.g. 85000"
            value={formData.acquisitionCost}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.acquisitionCost && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.acquisitionCost}
            </div>
          )}
        </div>

        {/* Region */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="region">
            Operating Region
          </label>
          <input
            type="text"
            id="region"
            name="region"
            className="form-control-custom"
            placeholder="e.g. West Coast Division"
            value={formData.region}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Status (Only on Edit or with Fleet Manager override) */}
        <div className="col-12 form-group-custom">
          <label className="form-label-custom" htmlFor="status">
            Operational Status
          </label>
          <select
            id="status"
            name="status"
            className="form-control-custom"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
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
          {isSubmitting ? 'Saving changes...' : vehicle ? 'Save Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </motion.form>
  );
};

export default VehicleForm;
