import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Form component to create or update Expense records.
 * @param {Object} props
 * @param {Object} props.expense - Initial expense details if editing.
 * @param {Array} props.vehicles - List of vehicles to populate dropdown.
 * @param {Array} props.trips - List of trips to populate dropdown (optional).
 * @param {Function} props.onSubmit - Triggered on form submit with form data.
 * @param {Function} props.onCancel - Triggered on cancel action.
 * @param {boolean} props.isSubmitting - Toggle loading state for buttons.
 */
export const ExpenseForm = ({
  expense = null,
  vehicles = [],
  trips = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    vehicle: '',
    trip: '',
    expenseType: 'Fuel',
    amount: '',
    expenseDate: '',
    paymentMethod: 'Card',
    receiptUrl: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      const formattedDate = expense.expenseDate
        ? new Date(expense.expenseDate).toISOString().split('T')[0]
        : '';

      setFormData({
        vehicle: expense.vehicle?._id || expense.vehicle || '',
        trip: expense.trip?._id || expense.trip || '',
        expenseType: expense.expenseType || 'Fuel',
        amount: expense.amount || '',
        expenseDate: formattedDate,
        paymentMethod: expense.paymentMethod || 'Card',
        receiptUrl: expense.receiptUrl || '',
        description: expense.description || '',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        vehicle: vehicles[0]?._id || '',
        trip: '',
        expenseType: 'Fuel',
        amount: '',
        expenseDate: today,
        paymentMethod: 'Card',
        receiptUrl: '',
        description: '',
      });
    }
    setErrors({});
  }, [expense, vehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicle) {
      newErrors.vehicle = 'Vehicle selection is required';
    }

    if (!formData.expenseType) {
      newErrors.expenseType = 'Expense category is required';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Expense date is required';
    }

    if (formData.receiptUrl) {
      try {
        new URL(formData.receiptUrl);
      } catch (_) {
        newErrors.receiptUrl = 'Receipt Link must be a valid URL';
      }
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
      <h3 className="mb-4">{expense ? 'Edit Expense Record' : 'Log New Expense'}</h3>

      <div className="row">
        {/* Vehicle Reference */}
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

        {/* Assigned Trip */}
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
            <option value="">-- None / General Fleet Cost --</option>
            {trips.map((t) => (
              <option key={t._id} value={t._id}>
                {t.tripNumber || t.tripCode || t._id}
              </option>
            ))}
          </select>
        </div>

        {/* Expense Category */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="expenseType">
            Expense Type / Category
          </label>
          <select
            id="expenseType"
            name="expenseType"
            className="form-control-custom"
            value={formData.expenseType}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="Fuel">Fuel Purchase</option>
            <option value="Maintenance">Scheduled Maintenance</option>
            <option value="Toll">Road Toll / Highway Cost</option>
            <option value="Insurance">Asset Insurance Fee</option>
            <option value="Repair">Unexpected Repair</option>
            <option value="Other">Other Operational Cost</option>
          </select>
        </div>

        {/* Amount */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="amount">
            Cost Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            className={`form-control-custom ${errors.amount ? 'is-invalid' : ''}`}
            placeholder="e.g. 150.00"
            value={formData.amount}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.amount && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.amount}</div>
          )}
        </div>

        {/* Expense Date */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="expenseDate">
            Expense Incurred Date
          </label>
          <input
            type="date"
            id="expenseDate"
            name="expenseDate"
            className={`form-control-custom ${errors.expenseDate ? 'is-invalid' : ''}`}
            value={formData.expenseDate}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.expenseDate && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.expenseDate}</div>
          )}
        </div>

        {/* Payment Method */}
        <div className="col-md-6 form-group-custom">
          <label className="form-label-custom" htmlFor="paymentMethod">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="form-control-custom"
            value={formData.paymentMethod}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="Card">Credit/Debit Card</option>
            <option value="Cash">Cash Transaction</option>
            <option value="UPI">UPI Payment</option>
            <option value="Bank Transfer">Direct Bank Transfer</option>
          </select>
        </div>

        {/* Receipt URL */}
        <div className="col-12 form-group-custom">
          <label className="form-label-custom" htmlFor="receiptUrl">
            Digital Receipt Attachment URL
          </label>
          <input
            type="url"
            id="receiptUrl"
            name="receiptUrl"
            className={`form-control-custom ${errors.receiptUrl ? 'is-invalid' : ''}`}
            placeholder="e.g. https://invoice-storage.cloud/receipt-4091.pdf"
            value={formData.receiptUrl}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.receiptUrl && (
            <div className="invalid-feedback text-danger text-small mt-1">{errors.receiptUrl}</div>
          )}
        </div>

        {/* Description */}
        <div className="col-12 form-group-custom">
          <label className="form-label-custom" htmlFor="description">
            Description & Memo Notes
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="form-control-custom"
            placeholder="Add any specific context, store names, or invoice details..."
            value={formData.description}
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
          {isSubmitting ? 'Saving...' : expense ? 'Save Changes' : 'Log Expense'}
        </button>
      </div>
    </motion.form>
  );
};

export default ExpenseForm;
