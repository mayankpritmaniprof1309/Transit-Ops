import React, { useState, useEffect } from 'react';
import { getDriver, updateDriver } from '../../services/driver.service.js';
import DriverForm from '../../components/driver/DriverForm.jsx';

/**
 * Page container to edit existing drivers.
 * @param {Object} props
 * @param {string} [props.driverId] - Driver ID to load.
 * @param {Object} [props.driver] - Preloaded driver object data (optional shortcut).
 * @param {Function} props.onSuccess - Action triggered on successful form submission.
 * @param {Function} props.onCancel - Action triggered when cancelling.
 */
export const EditDriver = ({ driverId, driver: preloadedDriver = null, onSuccess, onCancel }) => {
  const [driver, setDriver] = useState(preloadedDriver);
  const [loading, setLoading] = useState(!preloadedDriver);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (driverId && !preloadedDriver) {
      const fetchDriver = async () => {
        try {
          setLoading(true);
          setError('');
          const res = await getDriver(driverId);
          if (res.success) {
            setDriver(res.data);
          } else {
            setError(res.message || 'Failed to retrieve driver portfolio');
          }
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || 'Server connection error');
        } finally {
          setLoading(false);
        }
      };
      fetchDriver();
    }
  }, [driverId, preloadedDriver]);

  const handleSubmit = async (formData) => {
    const id = driverId || (driver ? driver._id : null);
    if (!id) return;
    try {
      setIsSubmitting(true);
      setError('');
      const res = await updateDriver(id, formData);
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
      {driver && (
        <DriverForm
          driver={driver}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default EditDriver;
