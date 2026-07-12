import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import * as authService from '../../services/auth.service.js';

/**
 * ResetPassword — allow user to reset password using a token from an email link.
 * Route: /reset-password/:token
 */
export default function ResetPassword() {
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

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
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
    } catch (err) {
      setApiError(
        err.response?.data?.message || err.message || 'Token is invalid or has expired.'
      );
    } finally {
      setLoading(false);
    }
  };

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
        {/* Branding header */}
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
            {success ? 'Password Reset' : 'Reset Password'}
          </h2>
          <p className="text-muted mb-0">
            {success ? 'Your password has been updated' : 'Create a new secure password'}
          </p>
        </div>

        {success ? (
          /* Success confirmation */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center py-3">
              <FaCheckCircle size={48} className="text-success mb-3" />
              <p className="text-secondary mb-4">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="btn-custom btn-primary-gradient w-100 justify-content-center py-3 text-decoration-none"
              >
                Go to Login
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Reset form */
          <>
            {apiError && (
              <motion.div
                className="alert alert-danger border-0 rounded-3 mb-4 text-small d-flex flex-column gap-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FaExclamationCircle className="text-danger flex-shrink-0" />
                  <span>{apiError}</span>
                </div>
                <div className="mt-2 text-center">
                  <Link
                    to="/forgot-password"
                    className="btn btn-sm btn-outline-danger w-100"
                  >
                    Request a new reset link
                  </Link>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* New Password */}
              <div className="form-group-custom position-relative">
                <label className="form-label-custom" htmlFor="rp-password">
                  New Password
                </label>
                <div className="position-relative">
                  <FaLock className="position-absolute text-muted" style={iconStyle} />
                  <input
                    type="password"
                    id="rp-password"
                    name="password"
                    className={`form-control-custom ps-5${errors.password ? ' is-invalid' : ''}`}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                  />
                </div>
                {errors.password && <div className="text-danger text-small mt-1">{errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="form-group-custom position-relative mt-3">
                <label className="form-label-custom" htmlFor="rp-confirmPassword">
                  Confirm Password
                </label>
                <div className="position-relative">
                  <FaLock className="position-absolute text-muted" style={iconStyle} />
                  <input
                    type="password"
                    id="rp-confirmPassword"
                    name="confirmPassword"
                    className={`form-control-custom ps-5${errors.confirmPassword ? ' is-invalid' : ''}`}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="text-danger text-small mt-1">{errors.confirmPassword}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-custom btn-primary-gradient w-100 justify-content-center py-3 mt-4"
              >
                {loading ? 'Updating…' : 'Reset Password'}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link to="/login" className="text-muted text-decoration-none">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
