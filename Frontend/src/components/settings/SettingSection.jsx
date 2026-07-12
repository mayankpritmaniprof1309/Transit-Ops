import React from 'react';

/**
 * SettingSection represents a settings category title and subtitle block.
 */
export default function SettingSection({ title, subtitle, children }) {
  return (
    <div className="mb-5">
      <div className="border-bottom pb-3 mb-4">
        <h4 className="fw-bold mb-1 text-dark">{title}</h4>
        {subtitle && <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
