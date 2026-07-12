import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaBell, FaPalette, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Import Settings subcomponents
import ProfileCard from '../../components/settings/ProfileCard.jsx';
import ProfileForm from '../../components/settings/ProfileForm.jsx';
import SecuritySettings from '../../components/settings/SecuritySettings.jsx';
import NotificationSettings from '../../components/settings/NotificationSettings.jsx';
import AppearanceSettings from '../../components/settings/AppearanceSettings.jsx';
import SystemInformation from '../../components/settings/SystemInformation.jsx';
import DangerZone from '../../components/settings/DangerZone.jsx';

// Import services
import * as settingsService from '../../services/settings.service.js';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [appearance, setAppearance] = useState(null);
  const [globalError, setGlobalError] = useState('');

  // Load user data & preferences on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setGlobalError('');
      try {
        const cachedUser = localStorage.getItem('user');
        let currentUser = cachedUser ? JSON.parse(cachedUser) : null;
        
        if (currentUser && currentUser._id) {
          try {
            const apiRes = await settingsService.getProfile(currentUser._id);
            if (apiRes.success) {
              currentUser = apiRes.data;
              localStorage.setItem('user', JSON.stringify(currentUser));
            }
          } catch (apiErr) {
            console.warn('Backend profile fetch failed. Using local storage cache.', apiErr);
          }
        }
        setUser(currentUser);

        const notifyPrefs = settingsService.getNotificationPreferences();
        setPreferences(notifyPrefs);

        const visualPrefs = settingsService.getAppearance();
        setAppearance(visualPrefs);
      } catch (err) {
        setGlobalError('Failed to load profile parameters.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdateProfile = async (formData) => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await settingsService.updateProfile(user._id, formData);
      if (res.success) {
        setUser(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (passwordData) => {
    if (!user?._id) return;
    setLoading(true);
    try {
      await settingsService.changePassword(user._id, passwordData);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = (newPrefs) => {
    const saved = settingsService.updateNotificationPreferences(newPrefs);
    setPreferences(saved);
  };

  const handleSaveAppearance = (newVisuals) => {
    const saved = settingsService.updateAppearance(newVisuals);
    setAppearance(saved);
  };

  const handleDeactivate = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      await settingsService.deactivateAccount(user._id);
      settingsService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      await settingsService.deleteAccount(user._id);
      settingsService.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    settingsService.logout();
  };

  const tabs = [
    { id: 'profile', name: 'Profile Portfolio', icon: <FaUser /> },
    { id: 'security', name: 'Security & Access', icon: <FaLock /> },
    { id: 'notifications', name: 'Alert Feeds', icon: <FaBell /> },
    { id: 'appearance', name: 'Interface Customization', icon: <FaPalette /> },
    { id: 'system', name: 'System Information', icon: <FaInfoCircle /> },
  ];

  return (
    <div className="container-fluid px-0 py-2">
      {/* Page Header (Vercel Style glassmorphism border header wrapper) */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-1 small text-muted">
            <li className="breadcrumb-item">
              <a href="/dashboard" className="text-decoration-none text-secondary">Dashboard</a>
            </li>
            <li className="breadcrumb-item active text-dark fw-medium" aria-current="page">
              Settings
            </li>
          </ol>
        </nav>
        <h2 className="fw-extrabold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>Settings</h2>
        <p className="text-secondary mb-0">Manage your system credentials, alerts, layouts, and data options.</p>
      </div>

      {globalError && (
        <div className="alert alert-danger py-2.5 px-3 border-0 rounded-3 mb-4">
          {globalError}
        </div>
      )}

      {/* Horizontal Tabs Navigation (Vercel / GitHub / Linear Style) */}
      <div className="d-flex border-bottom mb-4 overflow-auto scrollbar-hidden" style={{ gap: '1.25rem' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn px-2 py-2.5 fw-semibold border-0 rounded-0 position-relative text-nowrap d-flex align-items-center gap-2 ${
                isActive ? 'text-primary' : 'text-secondary hover-primary'
              }`}
              style={{
                fontSize: '0.92rem',
                transition: 'color 0.25s ease',
                backgroundColor: 'transparent',
              }}
            >
              <span>{tab.icon}</span>
              {tab.name}
              {isActive && (
                <motion.div
                  layoutId="activeSettingsTab"
                  className="position-absolute bottom-0 start-0 end-0 bg-primary"
                  style={{ height: '2.5px' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Displaying Single Screen Content Container */}
      <div className="w-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'profile' && (
              <div className="d-flex flex-column gap-4">
                {/* Unified Stacked Profile Overview Banner */}
                <ProfileCard user={user} />

                {/* Edit Fields Panel Card */}
                <ProfileForm
                  user={user}
                  onSave={handleUpdateProfile}
                  loading={loading}
                />

                {/* Account Deletion and Logs Access Card */}
                <DangerZone
                  onDeactivateAccount={handleDeactivate}
                  onDeleteAccount={handleDelete}
                  onLogout={handleLogout}
                />
              </div>
            )}

            {activeTab === 'security' && (
              <SecuritySettings
                onChangePassword={handleChangePassword}
                loading={loading}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings
                preferences={preferences}
                onSave={handleSaveNotifications}
              />
            )}

            {activeTab === 'appearance' && (
              <AppearanceSettings
                appearance={appearance}
                onSave={handleSaveAppearance}
              />
            )}

            {activeTab === 'system' && (
              <SystemInformation user={user} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
