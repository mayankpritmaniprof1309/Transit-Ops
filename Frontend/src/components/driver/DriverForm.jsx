import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Form component to create or update Drivers.
 * @param {Object} props
 * @param {Object} props.driver - Initial driver data if editing.
 * @param {Function} props.onSubmit - Triggered on form submit with form data.
 * @param {Function} props.onCancel - Triggered on cancel action.
 * @param {boolean} props.isSubmitting - Toggle loading state for buttons.
 */
export const DriverForm = ({ driver = null, onSubmit, onCancel, isSubmitting = false }) => {
  // Define initial form states
  const [formData, setFormData] = useState({
    fullName: '',
    licenseNumber: '',
    licenseCategory: '',
    licenseExpiryDate: '',
    contactNumber: '',
    email: '',
    safetyScore: 100,
    status: 'Available',
    address: '',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState({});

  // Sync initial data if driver prop changes (e.g. edit mode opens)
  useEffect(() => {
    if (driver) {
      // Format ISO Date to YYYY-MM-DD for input element
      const formattedDate = driver.licenseExpiryDate
        ? new Date(driver.licenseExpiryDate).toISOString().split('T')[0]
        : '';

      setFormData({
        fullName: driver.fullName || '',
        licenseNumber: driver.licenseNumber || '',
        licenseCategory: driver.licenseCategory || '',
        licenseExpiryDate: formattedDate,
        contactNumber: driver.contactNumber || '',
        email: driver.email || '',
        safetyScore: driver.safetyScore !== undefined ? driver.safetyScore : 100,
        status: driver.status || 'Available',
        address: driver.address || '',
        emergencyContact: driver.emergencyContact || '',
      });
    } else {
      setFormData({
        fullName: '',
        licenseNumber: '',
        licenseCategory: '',
        licenseExpiryDate: '',
        contactNumber: '',
        email: '',
        safetyScore: 100,
        status: 'Available',
        address: '',
        emergencyContact: '',
      });
    }
    setErrors({});
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'safetyScore' ? (value === '' ? '' : Number(value)) : value,
    }));

    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.licenseCategory.trim()) {
      newErrors.licenseCategory = 'License category is required';
    }

    if (!formData.licenseExpiryDate) {
      newErrors.licenseExpiryDate = 'License expiry date is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (formData.safetyScore < 0 || formData.safetyScore > 100) {
      newErrors.safetyScore = 'Safety score must be between 0 and 100';
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
      <h3 className="mb-4">{driver ? 'Edit Driver Portfolio' : 'Enroll New Driver'}</h3>

      <div className="row">
        {/* Full Name */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={`form-control-custom ${errors.fullName ? 'is-invalid' : ''}`}
            placeholder="e.g. David Miller"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.fullName}</div>
          )}
        </div>

        {/* Contact Number */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="contactNumber">
            Contact Number
          </label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            className={`form-control-custom ${errors.contactNumber ? 'is-invalid' : ''}`}
            placeholder="e.g. +1 555-0199"
            value={formData.contactNumber}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.contactNumber && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.contactNumber}</div>
          )}
        </div>

        {/* License Number */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="licenseNumber">
            License Number
          </label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            className={`form-control-custom ${errors.licenseNumber ? 'is-invalid' : ''}`}
            placeholder="e.g. DL-12345678"
            value={formData.licenseNumber}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.licenseNumber && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.licenseNumber}</div>
          )}
        </div>

        {/* License Category */}
        <div className="col-md-3 form-group-custom">
          <label className="form-label-custom" htmlFor="licenseCategory">
            Class / Category
          </label>
          <input
            type="text"
            id="licenseCategory"
            name="licenseCategory"
            className={`form-control-custom ${errors.licenseCategory ? 'is-invalid' : ''}`}
            placeholder="e.g. Class A"
            value={formData.licenseCategory}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.licenseCategory && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.licenseCategory}
            </div>
          )}
        </div>

        {/* Expiry Date */}
        <div className="col-md-3 form-group-custom">
          <label className="form-label-custom" htmlFor="licenseExpiryDate">
            Expiry Date
          </label>
          <input
            type="date"
            id="licenseExpiryDate"
            name="licenseExpiryDate"
            className={`form-control-custom ${errors.licenseExpiryDate ? 'is-invalid' : ''}`}
            value={formData.licenseExpiryDate}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.licenseExpiryDate && (
            <div className="invalid-feedback text-danger text-small mt-1">
              {errors.licenseExpiryDate}
            </div>
          )}
        </div>

        {/* Email Address */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="email">
            Email Address (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control-custom ${errors.email ? 'is-invalid' : ''}`}
            placeholder="e.g. david@transitops.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.email}</div>
          )}
        </div>

        {/* Safety Score */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="safetyScore">
            Safety Score (0 - 100)
          </label>
          <input
            type="number"
            id="safetyScore"
            name="safetyScore"
            className={`form-control-custom ${errors.safetyScore ? 'is-invalid' : ''}`}
            min="0"
            max="100"
            placeholder="e.g. 98"
            value={formData.safetyScore}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.safetyScore && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.safetyScore}</div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="emergencyContact">
            Emergency Contact Info
          </label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            className="form-control-custom"
            placeholder="Name - Phone Relation"
            value={formData.emergencyContact}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* Status */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="status">
            Duty Status
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
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Address */}
        <div className="col-12 form-group-custom">
          <label className="form-label-custom" htmlFor="address">
            Residential Address
          </label>
          <textarea
            id="address"
            name="address"
            rows="2"
            className="form-control-custom"
            placeholder="Street address, City, State, Zip"
            value={formData.address}
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
          {isSubmitting ? 'Saving files...' : driver ? 'Save Changes' : 'Enroll Driver'}
        </button>
      </div>
    </motion.form>
  );
};

export default DriverForm;
