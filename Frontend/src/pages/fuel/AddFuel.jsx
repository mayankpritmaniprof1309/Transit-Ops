import React, { useState, useEffect } from 'react';
import { createFuelLog } from '../../services/fuel.service.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import tripService from '../../services/trip.service.js';
import FuelForm from '../../components/fuel/FuelForm.jsx';

/**
 * Page wrapper to register new Fuel purchase logs to TransitOps.
 * @param {Object} props
 * @param {Function} props.onSuccess - Action triggered on successful form submission.
 * @param {Function} props.onCancel - Action triggered when cancelling.
 */
export const AddFuel = ({ onSuccess, onCancel }) => {
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        setLoading(true);
        setError('');

        // Load Vehicles
        const resVehicles = await getAllVehicles({ limit: 100 });
        if (resVehicles.success) {
          setVehicles(resVehicles.data || []);
        }

        // Load Trips (Optional support)
        try {
          const resTrips = await tripService.getAllTrips();
          const tripsData = resTrips?.data || [];
          setTrips(tripsData.map(t => ({
            _id: t._id || t.id,
            tripNumber: t.tripNumber || t.route || `Trip ${t._id || t.id}`
          })));
        } catch (tErr) {
          console.warn('Failed to load trips list. Proceeding without active trips.');
        }

      } catch (err) {
        console.error(err);
        setError('Failed to retrieve vehicle details from database');
      } finally {
        setLoading(false);
      }
    };
    loadDependencies();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      const res = await createFuelLog(formData);
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
      <FuelForm
        vehicles={vehicles}
        trips={trips}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddFuel;
