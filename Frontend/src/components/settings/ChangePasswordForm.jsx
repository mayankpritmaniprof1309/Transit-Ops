import React, { useState } from 'react';
import SettingCard from './SettingCard.jsx';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ChangePasswordForm({ onSave, loading }) {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Evaluate password strength
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: 'bg-light' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score: 25, text: 'Weak', color: 'bg-danger' };
      case 2:
        return { score: 50, text: 'Medium', color: 'bg-warning' };
      case 3:
        return { score: 75, text: 'Good', color: 'bg-info' };
      case 4:
        return { score: 100, text: 'Strong', color: 'bg-success' };
      default:
        return { score: 0, text: 'Very Weak', color: 'bg-danger' };
    }
  };

  const strength = getPasswordStrength(passwords.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwords.currentPassword) {
      setError('Current password is required');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await onSave({
        currentPassword: passwords.currentPassword,
        password: passwords.newPassword,
      });
      setSuccess('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to change password.');
    }
  };

  return (
    <SettingCard>
      <h5 className="fw-bold mb-3 text-dark">Change Password</h5>

      {error && <div className="alert alert-danger py-2 px-3 border-0 rounded-3 mb-3">{error}</div>}
      {success && <div className="alert alert-success py-2 px-3 border-0 rounded-3 mb-3">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="form-group mb-3">
          <label className="form-label text-secondary fw-semibold" htmlFor="currentPassword">
            Current Password
          </label>
          <div className="position-relative">
            <FaLock className="position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showCurrent ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              className="form-control ps-5 pe-5 py-3 rounded-3"
              placeholder="••••••••"
              value={passwords.currentPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="position-absolute btn border-0 text-muted p-0"
              style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="form-group mb-3">
          <label className="form-label text-secondary fw-semibold" htmlFor="newPassword">
            New Password
          </label>
          <div className="position-relative">
            <FaLock className="position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showNew ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              className="form-control ps-5 pe-5 py-3 rounded-3"
              placeholder="••••••••"
              value={passwords.newPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="position-absolute btn border-0 text-muted p-0"
              style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {passwords.newPassword && (
            <div className="mt-2">
              <div className="progress" style={{ height: '6px' }}>
                <div
                  className={`progress-bar ${strength.color}`}
                  role="progressbar"
                  style={{ width: `${strength.score}%` }}
                  aria-valuenow={strength.score}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <small className="text-secondary mt-1 d-block">
                Password Strength:{' '}
                <span className={`fw-semibold text-${strength.color.replace('bg-', '')}`}>
                  {strength.text}
                </span>
              </small>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-4">
          <label className="form-label text-secondary fw-semibold" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <div className="position-relative">
            <FaLock className="position-absolute text-muted" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showConfirm ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className="form-control ps-5 pe-5 py-3 rounded-3"
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="position-absolute btn border-0 text-muted p-0"
              style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-premium-primary px-4"
            disabled={loading}
          >
            {loading ? 'Changing Password...' : 'Save Password'}
          </button>
        </div>
      </form>
    </SettingCard>
  );
}
