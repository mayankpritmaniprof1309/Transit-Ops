import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { forgotPassword } from '../../services/auth.service.js';

/**
 * ForgotPassword — request a password reset link via email.
 * Same glass-card + gradient design as Login/Register.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      // Always show success-like message for security (don't reveal if email exists).
      // Only show error on actual network/server failures.
      if (err.response?.status >= 500 || !err.response) {
        setError('Something went wrong. Please try again later.');
      } else {
        // Even on 404/400, show the confirmation to avoid email enumeration
        setSubmitted(true);
      }
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
            {submitted ? 'Check Your Email' : 'Forgot Password'}
          </h2>
          <p className="text-muted mb-0">
            {submitted
              ? "We've sent you instructions to reset your password."
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {submitted ? (
          /* Success confirmation */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center py-3">
              <FaCheckCircle size={48} className="text-success mb-3" />
              <p className="text-secondary mb-4">
                If an account exists with <strong>{email}</strong>, a password
                reset link has been sent. Please check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                className="btn-custom btn-primary-gradient w-100 justify-content-center py-3 text-decoration-none"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Email form */
          <>
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
              <div className="form-group-custom position-relative">
                <label className="form-label-custom" htmlFor="fp-email">
                  Email Address
                </label>
                <div className="position-relative">
                  <FaEnvelope
                    className="position-absolute text-muted"
                    style={iconStyle}
                  />
                  <input
                    type="email"
                    id="fp-email"
                    name="email"
                    className="form-control-custom ps-5"
                    placeholder="you@transitops.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-custom btn-primary-gradient w-100 justify-content-center py-3 mt-4"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-muted text-decoration-none d-inline-flex align-items-center gap-2"
              >
                <FaArrowLeft size={12} />
                <span>Back to Login</span>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
