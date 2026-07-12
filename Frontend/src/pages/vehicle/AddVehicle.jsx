import React, { useState } from 'react';
import { createVehicle } from '../../services/vehicle.service.js';
import VehicleForm from '../../components/vehicle/VehicleForm.jsx';

/**
 * Page wrapper to register new vehicles to TransitOps.
 * @param {Object} props
 * @param {Function} props.onSuccess - Action triggered on successful form submission.
 * @param {Function} props.onCancel - Action triggered when cancelling.
 */
export const AddVehicle = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      const res = await createVehicle(formData);
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
      <VehicleForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddVehicle;
