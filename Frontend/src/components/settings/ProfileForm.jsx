import React, { useState, useEffect, useRef } from 'react';
import SettingCard from './SettingCard.jsx';
import { FaUser, FaPhone, FaEnvelope, FaImage, FaUpload } from 'react-icons/fa';
import { uploadImage } from '../../services/api.js';

export default function ProfileForm({ user, onSave, loading }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      const res = await uploadImage(file);
      if (res.success) {
        setFormData((prev) => ({ ...prev, profileImage: res.url }));
        setSuccess('Image uploaded successfully! Click save to update your profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
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
        <div className="row g-4 mb-4 align-items-center">
          {/* Profile Image Section */}
          <div className="col-12 d-flex flex-column flex-md-row align-items-center gap-4 border-bottom pb-4 mb-2">
            <div 
              className="position-relative rounded-circle overflow-hidden bg-light border d-flex align-items-center justify-content-center"
              style={{ width: '100px', height: '100px', flexShrink: 0 }}
            >
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-100 h-100 object-fit-cover" />
              ) : (
                <FaUser size={40} className="text-secondary opacity-50" />
              )}
              {uploadingImage && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
                  <div className="spinner-border text-light spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center text-md-start">
              <h6 className="fw-semibold mb-1">Profile Photo</h6>
              <p className="text-muted small mb-2">JPG, PNG or WEBP. Max size of 5MB.</p>
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
              />
              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm px-3"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage || loading}
              >
                <FaUpload className="me-2" />
                Upload New Photo
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="col-12 col-md-6 mt-3">
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
          <div className="col-12 col-md-6 mt-3">
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
