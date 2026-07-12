import React, { useState, useEffect } from 'react';
import SettingCard from './SettingCard.jsx';
import { FaEnvelope, FaBell, FaExclamationTriangle, FaGasPump, FaFileInvoiceDollar, FaChartLine, FaMobileAlt } from 'react-icons/fa';

export default function NotificationSettings({ preferences, onSave }) {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    tripNotifications: true,
    maintenanceAlerts: true,
    fuelAlerts: true,
    expenseAlerts: true,
    reportReadyAlerts: false,
    pushNotifications: true,
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (preferences) {
      setPrefs(preferences);
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(prefs);
    setSuccess('Notification preferences saved successfully!');
    setTimeout(() => setSuccess(''), 4000);
  };

  const toggleItems = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive daily status digests, trip invoices, and system updates via email.',
      icon: <FaEnvelope className="text-primary" />,
    },
    {
      key: 'tripNotifications',
      title: 'Trip Notifications',
      description: 'Get notified immediately when a trip is dispatched, completed, or delayed.',
      icon: <FaBell className="text-success" />,
    },
    {
      key: 'maintenanceAlerts',
      title: 'Maintenance Alerts',
      description: 'Alerts when a vehicle is due for service or when repairs are approved.',
      icon: <FaExclamationTriangle className="text-warning" />,
    },
    {
      key: 'fuelAlerts',
      title: 'Fuel Alerts & Refills',
      description: 'Notifications on fuel logs approvals or warnings about low mileage/fuel efficiency.',
      icon: <FaGasPump className="text-info" />,
    },
    {
      key: 'expenseAlerts',
      title: 'Expense Alerts',
      description: 'Receive notifications on submitted expense approvals or spending warnings.',
      icon: <FaFileInvoiceDollar className="text-danger" />,
    },
    {
      key: 'reportReadyAlerts',
      title: 'Report Ready Alerts',
      description: 'Get notifications when weekly operational and financial analytics sheets compile.',
      icon: <FaChartLine className="text-purple" style={{ color: '#9333ea' }} />,
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Show real-time alerts on your browser screen during active operations.',
      icon: <FaMobileAlt className="text-secondary" />,
    },
  ];

  return (
    <SettingCard>
      <h5 className="fw-bold mb-3 text-dark">Notification Preferences</h5>
      <p className="text-secondary small mb-4">
        Customize exactly how and when you want to receive alerts and automated digests.
      </p>

      {success && <div className="alert alert-success py-2 px-3 border-0 rounded-3 mb-3">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-3 mb-4">
          {toggleItems.map((item) => (
            <div key={item.key} className="d-flex align-items-start justify-content-between p-3 rounded border border-light bg-light bg-opacity-50">
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded bg-white shadow-sm mt-1">
                  {item.icon}
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>{item.title}</h6>
                  <p className="text-secondary mb-0 small">{item.description}</p>
                </div>
              </div>
              <div className="form-check form-switch fs-5">
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  role="switch"
                  id={`switch-${item.key}`}
                  checked={prefs[item.key]}
                  onChange={() => handleToggle(item.key)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-premium-primary px-4">
            Save Preferences
          </button>
        </div>
      </form>
    </SettingCard>
  );
}
