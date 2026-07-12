import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaBriefcase } from 'react-icons/fa';
import { login, register } from '../../services/auth.service.js';

/**
 * Premium Login and Registration Gatekeeper view.
 * @param {Object} props
 * @param {Function} props.onAuthSuccess - Callback when login/registration succeeds.
 */
export const Login = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Fleet Manager',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
          setError('All fields are required for registration');
          setLoading(false);
          return;
        }
        await register(formData);
      } else {
        if (!formData.email.trim() || !formData.password.trim()) {
          setError('Email and Password are required');
          setLoading(false);
          return;
        }
        await login(formData.email, formData.password);
      }
      onAuthSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-3" style={{ background: 'var(--bg-gradient)' }}>
      <motion.div
        className="card-solid w-100 shadow-lg border p-4 p-md-5"
        style={{ maxWidth: '480px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Branding header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white mb-3" style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
            🚚
          </div>
          <h2 className="mb-1 fw-extrabold" style={{ letterSpacing: '-0.03em' }}>TransitOps</h2>
          <p className="text-muted mb-0">Smart Transport & Operations Platform</p>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            className="alert alert-danger border-0 rounded-3 mb-4 text-small"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className="form-group-custom position-relative">
              <label className="form-label-custom" htmlFor="fullName">Full Name</label>
              <div className="position-relative">
                <FaUser className="position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control-custom ps-5"
                  placeholder="e.g. David Miller"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group-custom position-relative">
            <label className="form-label-custom" htmlFor="email">Email Address</label>
            <div className="position-relative">
              <FaEnvelope className="position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                id="email"
                name="email"
                className="form-control-custom ps-5"
                placeholder="you@transitops.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group-custom position-relative">
            <label className="form-label-custom" htmlFor="password">Password</label>
            <div className="position-relative">
              <FaLock className="position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                id="password"
                name="password"
                className="form-control-custom ps-5"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group-custom position-relative">
              <label className="form-label-custom" htmlFor="role">Platform Role Designation</label>
              <div className="position-relative">
                <FaBriefcase className="position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  id="role"
                  name="role"
                  className="form-control-custom ps-5"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Fleet Manager">Fleet Manager (Full CRUD Access)</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Driver">Driver (Read-Only)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-custom btn-primary-gradient w-100 justify-content-center py-3 mt-4"
          >
            {loading ? 'Processing authentication...' : isRegister ? 'Enroll Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0 text-small">
            {isRegister ? 'Already registered?' : 'Access required?'} {' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="btn btn-link text-primary p-0 fw-semibold fs-6 text-decoration-none"
              style={{ border: 'none', background: 'transparent' }}
            >
              {isRegister ? 'Sign in instead' : 'Register an account'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
