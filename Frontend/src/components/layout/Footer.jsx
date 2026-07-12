import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer py-3 mt-auto border-top bg-white border-opacity-10 text-secondary" style={{ fontSize: '0.8rem' }}>
      <div className="container-fluid px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        <div>
          <span>&copy; {currentYear} </span>
          <span className="fw-semibold text-dark">TransitOps</span>
          <span>. All rights reserved.</span>
        </div>
        <div className="d-flex gap-3">
          <span className="text-secondary text-decoration-none">Privacy Policy</span>
          <span className="text-secondary text-decoration-none">Terms of Service</span>
          <span className="fw-medium text-dark">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
