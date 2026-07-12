import React, { useState, useEffect } from 'react';
import { getVehicle, updateVehicle } from '../../services/vehicle.service.js';
import VehicleForm from '../../components/vehicle/VehicleForm.jsx';

/**
 * Page container to edit existing vehicles.
 * @param {Object} props
 * @param {string} [props.vehicleId] - Vehicle ID to load.
 * @param {Object} [props.vehicle] - Preloaded vehicle object data (optional shortcut).
 * @param {Function} props.onSuccess - Action triggered on successful form submission.
 * @param {Function} props.onCancel - Action triggered when cancelling.
 */
export const EditVehicle = ({ vehicleId, vehicle: preloadedVehicle = null, onSuccess, onCancel }) => {
  const [vehicle, setVehicle] = useState(preloadedVehicle);
  const [loading, setLoading] = useState(!preloadedVehicle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicleId && !preloadedVehicle) {
      const fetchVehicle = async () => {
        try {
          setLoading(true);
          setError('');
          const res = await getVehicle(vehicleId);
          if (res.success) {
            setVehicle(res.data);
          } else {
            setError(res.message || 'Failed to retrieve vehicle details');
          }
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || 'Server connection error');
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [vehicleId, preloadedVehicle]);

  const handleSubmit = async (formData) => {
    const id = vehicleId || (vehicle ? vehicle._id : null);
    if (!id) return;
    try {
      setIsSubmitting(true);
      setError('');
      const res = await updateVehicle(id, formData);
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

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '800px' }}>
        <div className="card-solid p-5">
          <div className="skeleton-shimmer skeleton-box w-25 mb-4 mx-auto" style={{ height: '2rem' }}></div>
          <div className="skeleton-shimmer skeleton-box w-50 mb-3 mx-auto"></div>
          <div className="skeleton-shimmer skeleton-box w-75 mb-3 mx-auto"></div>
          <div className="skeleton-shimmer skeleton-box w-100 mb-3 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm" role="alert">
          {error}
        </div>
      )}
      {vehicle && (
        <VehicleForm
          vehicle={vehicle}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default EditVehicle;
