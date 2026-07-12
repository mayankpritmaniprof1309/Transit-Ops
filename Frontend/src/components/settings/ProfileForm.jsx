import React, { useState, useEffect } from 'react';
import SettingCard from './SettingCard.jsx';
import { FaUser, FaPhone, FaEnvelope, FaImage } from 'react-icons/fa';

export default function ProfileForm({ user, onSave, loading }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email address is required');
      return;
    }

    try {
      await onSave(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  return (
    <SettingCard>
      <div className="border-bottom pb-2 mb-4">
        <h5 className="fw-bold mb-1 text-dark">Edit Personal Portfolio</h5>
        <p className="text-secondary small mb-0">Update your account credentials and contact details.</p>
      </div>
      
      {error && <div className="alert alert-danger py-2 px-3 border-0 rounded-3 mb-3">{error}</div>}
      {success && <div className="alert alert-success py-2 px-3 border-0 rounded-3 mb-3">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Full Name */}
          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingFullName"
                name="fullName"
                placeholder="David Miller"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <label htmlFor="floatingFullName">
                <FaUser className="me-2 text-muted" /> Full Name
              </label>
            </div>
          </div>

          {/* Email Address */}
          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <label htmlFor="floatingEmail">
                <FaEnvelope className="me-2 text-muted" /> Email Address
              </label>
            </div>
          </div>

          {/* Phone Number */}
          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingPhone"
                name="phone"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="floatingPhone">
                <FaPhone className="me-2 text-muted" /> Phone Number
              </label>
            </div>
          </div>

          {/* Profile Image URL */}
          <div className="col-12 col-md-6">
            <div className="form-floating">
              <input
                type="url"
                className="form-control"
                id="floatingProfileImage"
                name="profileImage"
                placeholder="https://example.com/avatar.jpg"
                value={formData.profileImage}
                onChange={handleChange}
                disabled={loading}
              />
              <label htmlFor="floatingProfileImage">
                <FaImage className="me-2 text-muted" /> Profile Image URL
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4 pt-2">
          <button
            type="submit"
            className="btn btn-premium-primary px-4 py-2.5"
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </SettingCard>
  );
}
