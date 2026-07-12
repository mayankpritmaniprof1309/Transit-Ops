import React, { useState } from 'react';
import { createDriver } from '../../services/driver.service.js';
import DriverForm from '../../components/driver/DriverForm.jsx';

/**
 * Page wrapper to register new drivers to TransitOps.
 * @param {Object} props
 * @param {Function} props.onSuccess - Action triggered on successful form submission.
 * @param {Function} props.onCancel - Action triggered when cancelling.
 */
export const AddDriver = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      const res = await createDriver(formData);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm" role="alert">
          {error}
        </div>
      )}
      <DriverForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddDriver;
