import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import tripService from '../../services/trip.service.js';
import { FaTruck, FaMap, FaDollarSign, FaCalendarAlt, FaFileInvoice, FaCreditCard } from 'react-icons/fa';

export default function ExpenseForm({ expense, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    vehicle: '',
    trip: '',
    expenseType: 'Fuel',
    amount: '',
    expenseDate: '',
    description: '',
    paymentMethod: 'Cash',
  });

  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Fetch dropdown list items
  useEffect(() => {
    const loadDropdowns = async () => {
      setFetchingData(true);
      try {
        // Load Vehicles
        const vehRes = await getAllVehicles({ limit: 100 });
        let vehList = [];
        if (vehRes.success && vehRes.data) {
          vehList = Array.isArray(vehRes.data) ? vehRes.data : (vehRes.data.vehicles || []);
        }
        setVehicles(vehList);

        // Load Trips using the tripService (which pulls from local storage mock/synced trips)
        let tripList = [];
        try {
          const resTrips = await tripService.getAllTrips();
          const tripsData = resTrips?.data || [];
          tripList = tripsData.map(t => ({
            _id: t._id || t.id?.toString() || '',
            startLocation: t.startLocation || t.route || `Trip #${t.id}`,
            endLocation: t.endLocation || '',
            tripStatus: t.tripStatus || t.status || 'Draft'
          }));
        } catch (tErr) {
          console.warn('Failed to load trips from service.', tErr);
        }
        setTrips(tripList);
      } catch (err) {
        console.error('Failed to load vehicles/trips for selection.', err);
      } finally {
        setFetchingData(false);
      }
    };
    loadDropdowns();
  }, []);

  // Populate data when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        vehicle: expense.vehicle?._id || expense.vehicle || '',
        trip: expense.trip?._id || expense.trip || '',
        expenseType: expense.expenseType || 'Fuel',
        amount: expense.amount || '',
        expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().substring(0, 10) : '',
        description: expense.description || '',
        paymentMethod: expense.paymentMethod || 'Cash',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.vehicle) {
      setValidationError('Please select a vehicle.');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setValidationError('Please enter a valid expense amount.');
      return;
    }
    if (!formData.expenseDate) {
      setValidationError('Please select the date of expense.');
      return;
    }

    onSave(formData);
  };

  const categories = ['Fuel', 'Maintenance', 'Toll', 'Insurance', 'Repair', 'Other'];
  const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Fuel Card'];

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
              disabled={loading || fetchingData}
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
              <FaTruck className="me-2 text-muted" /> Vehicle
            </label>
          </div>
        </div>

        {/* Trip */}
        <div className="col-12 col-md-6">
          <div className="form-floating">
            <select
              id="formTrip"
              name="trip"
              className="form-select bg-light border-light"
              value={formData.trip}
              onChange={handleChange}
              disabled={loading || fetchingData}
            >
              <option value="">No Associated Trip (N/A)</option>
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.startLocation}{t.endLocation ? ` → ${t.endLocation}` : ''} ({t.tripStatus || 'Draft'})
                </option>
              ))}
            </select>
            <label htmlFor="formTrip">
              <FaMap className="me-2 text-muted" /> Associated Trip
            </label>
          </div>
        </div>

        {/* Category (Expense Type) */}
        <div className="col-12 col-md-4">
          <div className="form-floating">
            <select
              id="formCategory"
              name="expenseType"
              className="form-select bg-light border-light"
              value={formData.expenseType}
              onChange={handleChange}
              disabled={loading}
              required
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label htmlFor="formCategory">
              <FaFileInvoice className="me-2 text-muted" /> Expense Type
            </label>
          </div>
        </div>

        {/* Amount */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="form-floating">
            <input
              type="number"
              id="formAmount"
              name="amount"
              className="form-control bg-light border-light"
              placeholder="100"
              value={formData.amount}
              onChange={handleChange}
              disabled={loading}
              min="0.01"
              step="0.01"
              required
            />
            <label htmlFor="formAmount">
              <FaDollarSign className="me-2 text-muted" /> Amount ($)
            </label>
          </div>
        </div>

        {/* Date */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="form-floating">
            <input
              type="date"
              id="formDate"
              name="expenseDate"
              className="form-control bg-light border-light"
              value={formData.expenseDate}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <label htmlFor="formDate">
              <FaCalendarAlt className="me-2 text-muted" /> Expense Date
            </label>
          </div>
        </div>

        {/* Payment Method */}
        <div className="col-12">
          <div className="form-floating">
            <select
              id="formPaymentMethod"
              name="paymentMethod"
              className="form-select bg-light border-light"
              value={formData.paymentMethod}
              onChange={handleChange}
              disabled={loading}
              required
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <label htmlFor="formPaymentMethod">
              <FaCreditCard className="me-2 text-muted" /> Payment Method
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="col-12">
          <div className="form-floating">
            <textarea
              id="formDescription"
              name="description"
              className="form-control bg-light border-light"
              placeholder="Refuel logs for truck route..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              style={{ height: '100px' }}
            />
            <label htmlFor="formDescription">Description / Extra Notes</label>
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
          {loading ? 'Processing...' : expense ? 'Update Expense' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
}
