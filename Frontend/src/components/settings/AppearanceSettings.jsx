import React, { useState, useEffect } from 'react';
import SettingCard from './SettingCard.jsx';
import { FaCheckCircle, FaSun, FaMoon, FaLaptop, FaTextHeight, FaColumns } from 'react-icons/fa';

export default function AppearanceSettings({ appearance, onSave }) {
  const [config, setConfig] = useState({
    theme: 'Light Theme',
    accentColor: 'Blue',
    fontSize: 'Medium',
    sidebar: 'Expanded',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (appearance) {
      setConfig(appearance);
    }
  }, [appearance]);

  const handleSelect = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(config);
    setSuccess('Appearance settings saved and applied!');
    setTimeout(() => setSuccess(''), 4000);
  };

  const accentColors = [
    { name: 'Blue', hex: '#2563EB', class: 'bg-primary' },
    { name: 'Purple', hex: '#9333EA', class: 'bg-purple' },
    { name: 'Green', hex: '#10B981', class: 'bg-success' },
  ];

  return (
    <SettingCard>
      <h5 className="fw-bold mb-3 text-dark">Appearance Settings</h5>
      <p className="text-secondary small mb-4">
        Customize the visual structure and behavior of your operations panel.
      </p>

      {success && <div className="alert alert-success py-2 px-3 border-0 rounded-3 mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Theme Selector */}
        <div className="mb-4">
          <label className="form-label text-secondary fw-semibold mb-2">Theme Mode</label>
          <div className="row g-3">
            {[
              { name: 'Light Theme', icon: <FaSun />, desc: 'Classic bright look' },
              { name: 'Dark Theme', icon: <FaMoon />, desc: 'Future ready theme', future: true },
              { name: 'System Theme', icon: <FaLaptop />, desc: 'Syncs with device' },
            ].map((themeOpt) => {
              const isSelected = config.theme === themeOpt.name;
              return (
                <div key={themeOpt.name} className="col-12 col-sm-4">
                  <div
                    onClick={() => !themeOpt.future && handleSelect('theme', themeOpt.name)}
                    className={`card p-3 h-100 border text-center cursor-pointer position-relative hover-lift ${
                      isSelected ? 'border-primary bg-light' : 'border-light'
                    } ${themeOpt.future ? 'opacity-50' : ''}`}
                    style={{ cursor: themeOpt.future ? 'not-allowed' : 'pointer', borderRadius: '14px' }}
                  >
                    {themeOpt.future && (
                      <span className="position-absolute top-0 end-0 badge bg-secondary m-2" style={{ fontSize: '0.65rem' }}>
                        Soon
                      </span>
                    )}
                    <div className="fs-3 mb-2 text-primary">{themeOpt.icon}</div>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{themeOpt.name}</div>
                    <div className="text-secondary small mt-1">{themeOpt.desc}</div>
                    {isSelected && (
                      <FaCheckCircle className="position-absolute text-primary" style={{ top: '10px', right: '10px' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accent Colors */}
        <div className="mb-4">
          <label className="form-label text-secondary fw-semibold mb-2">Accent Theme Color</label>
          <div className="d-flex gap-3 align-items-center">
            {accentColors.map((color) => {
              const isSelected = config.accentColor === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleSelect('accentColor', color.name)}
                  className="rounded-circle border-0 d-flex align-items-center justify-content-center hover-lift position-relative"
                  style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: color.hex,
                    boxShadow: isSelected ? `0 0 0 3px #fff, 0 0 0 5px ${color.hex}` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  title={`${color.name} Accent`}
                >
                  {isSelected && <FaCheckCircle size={16} color="white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size & Sidebar Options */}
        <div className="row g-4 mb-4">
          {/* Font Size */}
          <div className="col-12 col-md-6">
            <label className="form-label text-secondary fw-semibold mb-2">
              <FaTextHeight className="me-2 text-muted" /> Interface Font Scale
            </label>
            <div className="d-flex gap-2">
              {['Small', 'Medium', 'Large'].map((size) => {
                const isSelected = config.fontSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSelect('fontSize', size)}
                    className={`btn flex-fill py-2 rounded-3 border ${
                      isSelected ? 'btn-primary-gradient border-0 text-white' : 'btn-light border-light text-dark'
                    }`}
                    style={{ fontSize: size === 'Small' ? '0.8rem' : size === 'Medium' ? '0.9rem' : '1rem' }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-md-6">
            <label className="form-label text-secondary fw-semibold mb-2">
              <FaColumns className="me-2 text-muted" /> Default Sidebar State
            </label>
            <div className="d-flex gap-2">
              {['Expanded', 'Collapsed'].map((layout) => {
                const isSelected = config.sidebar === layout;
                return (
                  <button
                    key={layout}
                    type="button"
                    onClick={() => handleSelect('sidebar', layout)}
                    className={`btn flex-fill py-2 rounded-3 border ${
                      isSelected ? 'btn-primary-gradient border-0 text-white' : 'btn-light border-light text-dark'
                    }`}
                  >
                    {layout}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-premium-primary px-4">
            Apply Appearance
          </button>
        </div>
      </form>
    </SettingCard>
  );
}
