import React, { useState } from 'react';
import ChangePasswordForm from './ChangePasswordForm.jsx';
import SettingCard from './SettingCard.jsx';
import { FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

export default function SecuritySettings({ onChangePassword, loading }) {
  const [deviceLogoutSuccess, setDeviceLogoutSuccess] = useState('');

  const handleLogoutAllDevices = () => {
    setDeviceLogoutSuccess('Successfully signed out of all other active sessions and devices.');
    setTimeout(() => setDeviceLogoutSuccess(''), 4000);
  };

  return (
    <div>
      {/* Session/Device Security */}
      <SettingCard className="border border-warning bg-light-warning">
        <div className="d-flex align-items-start gap-3">
          <div className="p-3 bg-warning text-white rounded-3">
            <FaShieldAlt size={22} />
          </div>
          <div className="flex-grow-1">
            <h5 className="fw-bold text-dark mb-1">Active Sessions & Devices</h5>
            <p className="text-secondary small mb-3">
              If you suspect unauthorized access or have signed in on public workstations, you can terminate all other user sessions immediately.
            </p>
            {deviceLogoutSuccess && (
              <div className="alert alert-success py-2 px-3 border-0 rounded-3 mb-3" style={{ fontSize: '0.9rem' }}>
                {deviceLogoutSuccess}
              </div>
            )}
            <button
              onClick={handleLogoutAllDevices}
              className="btn btn-premium-secondary"
            >
              <FaSignOutAlt className="me-2" /> Logout All Other Devices
            </button>
          </div>
        </div>
      </SettingCard>

      {/* Change Password form wrapper */}
      <ChangePasswordForm onSave={onChangePassword} loading={loading} />
    </div>
  );
}
