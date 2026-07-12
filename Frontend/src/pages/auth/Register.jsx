import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaBriefcase } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth.js';

/**
 * Register — Dedicated sign-up page for TransitOps.
 * Mirrors the Login page's glass-card + gradient background design.
 */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Fleet Manager',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the inline error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate all fields and return an errors object.
   * Returns empty object if everything is valid.
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Send only the fields the backend expects (no confirmPassword)
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
      // auth.service.register auto-logs in on success → AuthContext sets user
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* Shared icon positioning style */
  const iconStyle = { left: '1rem', top: '50%', transform: 'translateY(-50%)' };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <motion.div
        className="card-solid w-100 shadow-lg border p-4 p-md-5"
        style={{ maxWidth: '480px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Branding header — identical to Login */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center text-white mb-3"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              fontSize: '1.5rem',
            }}
          >
            🚚
          </div>
          <h2 className="mb-1 fw-extrabold" style={{ letterSpacing: '-0.03em' }}>
            Create Account
          </h2>
          <p className="text-muted mb-0">Join the TransitOps platform</p>
        </div>

        {/* API error banner */}
        {apiError && (
          <motion.div
            className="alert alert-danger border-0 rounded-3 mb-4 text-small"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {apiError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group-custom position-relative">
            <label className="form-label-custom" htmlFor="reg-fullName">
              Full Name
            </label>
            <div className="position-relative">
              <FaUser className="position-absolute text-muted" style={iconStyle} />
              <input
                type="text"
                id="reg-fullName"
                name="fullName"
                className={`form-control-custom ps-5${errors.fullName ? ' is-invalid' : ''}`}
                placeholder="e.g. David Miller"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.fullName && <div className="text-danger text-small mt-1">{errors.fullName}</div>}
          </div>

          {/* Email */}
          <div className="form-group-custom position-relative">
            <label className="form-label-custom" htmlFor="reg-email">
              Email Address
            </label>
            <div className="position-relative">
              <FaEnvelope className="position-absolute text-muted" style={iconStyle} />
              <input
                type="email"
                id="reg-email"
                name="email"
                className={`form-control-custom ps-5${errors.email ? ' is-invalid' : ''}`}
                placeholder="you@transitops.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.email && <div className="text-danger text-small mt-1">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group-custom position-relative">
            <label className="form-label-custom" htmlFor="reg-password">
              Password
            </label>
            <div className="position-relative">
              <FaLock className="position-absolute text-muted" style={iconStyle} />
              <input
                type="password"
                id="reg-password"
                name="password"
                className={`form-control-custom ps-5${errors.password ? ' is-invalid' : ''}`}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.password && <div className="text-danger text-small mt-1">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group-custom position-relative">
            <label className="form-label-custom" htmlFor="reg-confirmPassword">
              Confirm Password
            </label>
            <div className="position-relative">
              <FaLock className="position-absolute text-muted" style={iconStyle} />
              <input
                type="password"
                id="reg-confirmPassword"
                name="confirmPassword"
                className={`form-control-custom ps-5${errors.confirmPassword ? ' is-invalid' : ''}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.confirmPassword && (
              <div className="text-danger text-small mt-1">{errors.confirmPassword}</div>
            )}
          </div>

          {/* Role — required by backend */}
          <div className="form-group-custom position-relative">
            <label className="form-label-custom" htmlFor="reg-role">
              Platform Role
            </label>
            <div className="position-relative">
              <FaBriefcase className="position-absolute text-muted" style={iconStyle} />
              <select
                id="reg-role"
                name="role"
                className="form-control-custom ps-5"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Driver">Driver</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
                <option value="Dispatcher">Dispatcher</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-custom btn-primary-gradient w-100 justify-content-center py-3 mt-4"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-small">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary fw-semibold text-decoration-none"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
