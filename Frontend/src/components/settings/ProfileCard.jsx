import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaBuilding, FaIdBadge } from 'react-icons/fa';

/**
 * ProfileCard is a premium glassmorphic banner header summarizing the user's identity.
 */
export default function ProfileCard({ user }) {
  const getInitials = (name) => {
    if (!name) return 'TO';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const employeeId = user?._id ? `EMP-${user._id.substring(user._id.length - 6).toUpperCase()}` : 'EMP-007842';
  const department = user?.role === 'Financial Analyst' ? 'Finance & Accounts' : 'Fleet Operations';

  return (
    <motion.div
      className="glass-effect rounded-4 p-4 mb-4 border border-white text-dark shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="d-flex flex-col flex-md-row align-items-center gap-4">
        {/* User Avatar / Initials */}
        <div className="flex-shrink-0">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="rounded-circle shadow border border-3 border-white"
              style={{ width: '90px', height: '90px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-extrabold shadow border border-3 border-white"
              style={{ width: '90px', height: '90px', fontSize: '2rem' }}
            >
              {getInitials(user?.fullName)}
            </div>
          )}
        </div>

        {/* Identity Details */}
        <div className="flex-grow-1 text-center text-md-start">
          <div className="d-flex flex-column flex-sm-row align-items-center gap-2 mb-2 justify-content-center justify-content-md-start">
            <h3 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.02em' }}>
              {user?.fullName || 'TransitOps User'}
            </h3>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2.5 py-1.5 rounded-pill font-semibold small">
              {user?.role || 'Fleet Manager'}
            </span>
          </div>
          <p className="text-secondary mb-0 small">Logged in as {user?.email || 'N/A'}</p>
        </div>
      </div>

      {/* Grid of Profile Stats & Details */}
      <div className="row g-3 mt-3 pt-3 border-top border-white border-opacity-40">
        <div className="col-6 col-md-3">
          <div className="d-flex align-items-center gap-2">
            <FaIdBadge className="text-primary opacity-75" />
            <div>
              <small className="text-secondary d-block lh-1 mb-0.5" style={{ fontSize: '0.75rem' }}>Employee ID</small>
              <span className="fw-semibold text-dark small">{employeeId}</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="d-flex align-items-center gap-2">
            <FaBuilding className="text-primary opacity-75" />
            <div>
              <small className="text-secondary d-block lh-1 mb-0.5" style={{ fontSize: '0.75rem' }}>Department</small>
              <span className="fw-semibold text-dark small">{department}</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="d-flex align-items-center gap-2">
            <FaEnvelope className="text-primary opacity-75" />
            <div>
              <small className="text-secondary d-block lh-1 mb-0.5" style={{ fontSize: '0.75rem' }}>Email Address</small>
              <span className="fw-semibold text-dark small text-truncate d-inline-block" style={{ maxWidth: '160px' }}>
                {user?.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="d-flex align-items-center gap-2">
            <FaPhone className="text-primary opacity-75" />
            <div>
              <small className="text-secondary d-block lh-1 mb-0.5" style={{ fontSize: '0.75rem' }}>Phone Number</small>
              <span className="fw-semibold text-dark small">{user?.phone || 'Not Specified'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
