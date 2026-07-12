import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTruck, FaWarehouse, FaDollarSign, FaWeightHanging, FaTachometerAlt } from 'react-icons/fa';
import { getVehicle } from '../../services/vehicle.service.js';

/**
 * Dedicated specs sheet view for a Vehicle.
 * @param {Object} props
 * @param {string} props.vehicleId - Vehicle ID to load.
 * @param {Function} props.onBack - Callback to return to the list.
 * @param {Function} props.onEdit - Callback to trigger editing.
 */
export const ViewVehicle = ({ vehicleId, onBack, onEdit }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicleId) {
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
  }, [vehicleId]);

  const getStatusClass = (statusVal) => {
    switch (statusVal) {
      case 'Available':
        return 'badge-status-available';
      case 'On Trip':
        return 'badge-status-on-trip';
      case 'In Shop':
        return 'badge-status-in-shop';
      case 'Retired':
        return 'badge-status-retired';
      default:
        return 'bg-secondary text-white';
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '800px' }}>
        <div className="card-solid p-5">
          <div className="skeleton-shimmer skeleton-circle mb-4" style={{ width: '80px', height: '80px' }}></div>
          <div className="skeleton-shimmer skeleton-box w-25 mb-4 mx-auto" style={{ height: '2rem' }}></div>
          <div className="skeleton-shimmer skeleton-box w-50 mb-3 mx-auto"></div>
          <div className="skeleton-shimmer skeleton-box w-75 mb-3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container py-5" style={{ maxWidth: '800px' }}>
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm" role="alert">
          {error || 'Vehicle not found'}
        </div>
        <button onClick={onBack} className="btn-custom btn-secondary-custom">
          <FaArrowLeft /> Back to Fleet List
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      {/* Top Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={onBack} className="btn-custom btn-secondary-custom">
          <FaArrowLeft /> Back
        </button>
        <button onClick={() => onEdit(vehicleId)} className="btn-custom btn-primary-gradient shadow-sm">
          <FaEdit /> Edit Specs
        </button>
      </div>

      <motion.div
        className="card-solid"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Banner Details */}
        <div className="text-center pb-4 mb-4 border-bottom">
          <div className="d-inline-block bg-primary-light text-primary p-3 rounded-circle mb-3" style={{ background: 'rgba(37, 99, 235, 0.08)' }}>
            <FaTruck className="fs-1" />
          </div>
          <h2 className="mb-1">{vehicle.vehicleName}</h2>
          <span className="text-small font-monospace mb-3 bg-light d-inline-block px-3 py-1 border rounded text-dark">
            {vehicle.registrationNumber}
          </span>
          <div className="mt-2">
            <span className={`badge-status ${getStatusClass(vehicle.status)}`}>
              {vehicle.status}
            </span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="row g-3">
          {/* Type */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light">
              <span className="text-small text-muted d-block mb-1">Vehicle Classification</span>
              <strong className="text-dark fs-5">{vehicle.vehicleType}</strong>
            </div>
          </div>

          {/* Model */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light">
              <span className="text-small text-muted d-block mb-1">Model Spec</span>
              <strong className="text-dark fs-5 text-truncate d-block" title={vehicle.vehicleModel}>
                {vehicle.vehicleModel}
              </strong>
            </div>
          </div>

          {/* Capacity */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaWeightHanging className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">Max Load Capacity</span>
                <strong className="text-dark fs-5">{vehicle.maximumLoadCapacity.toLocaleString()} kg</strong>
              </div>
            </div>
          </div>

          {/* Odometer */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaTachometerAlt className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">Odometer Reading</span>
                <strong className="text-dark fs-5">{vehicle.odometer.toLocaleString()} km</strong>
              </div>
            </div>
          </div>

          {/* Cost */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaDollarSign className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">Acquisition Cost</span>
                <strong className="text-dark fs-5">${vehicle.acquisitionCost.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Region */}
          <div className="col-sm-6">
            <div className="border rounded p-3 bg-light d-flex align-items-center gap-3">
              <FaWarehouse className="text-primary fs-3" />
              <div>
                <span className="text-small text-muted d-block">Operating Division</span>
                <strong className="text-dark fs-5">{vehicle.region || 'N/A'}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-top d-flex flex-wrap justify-content-between text-small text-muted">
          <span>Registered: {new Date(vehicle.createdAt).toLocaleDateString()}</span>
          <span>Last Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewVehicle;
