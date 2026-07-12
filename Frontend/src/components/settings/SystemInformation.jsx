import React, { useState, useEffect } from 'react';
import SettingCard from './SettingCard.jsx';
import api from '../../services/api.js';
import { FaServer, FaDatabase, FaClock, FaLaptopCode, FaGlobe } from 'react-icons/fa';

export default function SystemInformation({ user }) {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [backendVersion, setBackendVersion] = useState('v1.0.0');

  useEffect(() => {
    const testApi = async () => {
      try {
        await api.get('/dashboard'); // Verify we can make an authorized handshake
        setApiStatus('Online & Connected');
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setApiStatus('Online (Handshake Successful)');
        } else {
          setApiStatus('Offline / Connection Failed');
        }
      }
    };
    testApi();
  }, []);

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let temp;
    let match = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(match[1])) {
      temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return `IE ${temp[1] || ''}`;
    }
    if (match[1] === 'Chrome') {
      temp = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (temp != null) return temp.slice(1).join(' ').replace('OPR', 'Opera');
    }
    match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((temp = ua.match(/version\/(\d+)/i)) != null) match.splice(1, 1, temp[1]);
    return match.join(' ');
  };

  const currentSessionStart = new Date().toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const appVersion = 'v1.0.0';
  const environment = import.meta.env.MODE === 'development' ? 'Development (Localhost)' : 'Production';

  const systemStats = [
    {
      category: 'Application Environment',
      icon: <FaLaptopCode className="text-primary" />,
      items: [
        { label: 'Application Version', value: appVersion },
        { label: 'Environment Target', value: environment },
        { label: 'Frontend Client Port', value: '5173 (Vite)' },
      ],
    },
    {
      category: 'API & Microservice Status',
      icon: <FaServer className="text-success" />,
      items: [
        { label: 'API Gateway Status', value: apiStatus, badge: apiStatus.includes('Online') ? 'success' : 'danger' },
        { label: 'Backend Server Version', value: backendVersion },
        { label: 'Base endpoint URL', value: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' },
      ],
    },
    {
      category: 'Database Cluster Config',
      icon: <FaDatabase className="text-warning" />,
      items: [
        { label: 'Database Service', value: 'MongoDB Atlas' },
        { label: 'Mongoose Engine Version', value: 'v9.7.4' },
      ],
    },
    {
      category: 'Client Session Stats',
      icon: <FaClock className="text-info" />,
      items: [
        { label: 'Current Session Lock', value: `Active since ${currentSessionStart}` },
        { label: 'Last Logged Activity', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now' },
      ],
    },
    {
      category: 'System Signature',
      icon: <FaGlobe className="text-secondary" />,
      items: [
        { label: 'Resolved Browser Engine', value: getBrowserInfo() },
        { label: 'Platform Architecture', value: navigator.platform || 'x86_64' },
      ],
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {systemStats.map((section, idx) => (
        <SettingCard key={idx} className="mb-0">
          <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
            <div className="fs-4">{section.icon}</div>
            <h6 className="fw-bold mb-0 text-dark">{section.category}</h6>
          </div>
          <div className="row g-3">
            {section.items.map((item, itemIdx) => (
              <div key={itemIdx} className="col-12 col-md-6 col-lg-4">
                <small className="text-secondary d-block mb-1">{item.label}</small>
                {item.badge ? (
                  <span className={`badge bg-${item.badge} px-2.5 py-1.5 rounded fw-semibold`}>
                    {item.value}
                  </span>
                ) : (
                  <span className="fw-semibold text-dark" style={{ wordBreak: 'break-all' }}>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </SettingCard>
      ))}
    </div>
  );
}
