import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSync, FaFileCsv, FaFilePdf, FaChevronDown } from 'react-icons/fa';

export default function AnalyticsHeader({
  onRefresh,
  onExportCSV,
  onExportPDF,
  loading,
}) {
  const [showCsvMenu, setShowCsvMenu] = useState(false);

  const csvOptions = [
    { label: 'Trips Report', type: 'trips' },
    { label: 'Vehicles Report', type: 'vehicles' },
    { label: 'Drivers Report', type: 'drivers' },
    { label: 'Expenses Report', type: 'expenses' },
    { label: 'Fuel Logs Report', type: 'fuel_logs' },
  ];

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 no-print">
      <div>
        <h1 className="fw-extrabold text-dark mb-1" style={{ letterSpacing: '-0.03em', fontSize: '1.85rem' }}>
          Reports & Analytics
        </h1>
        <p className="text-secondary mb-0 text-small">
          Monitor fleet performance, operational costs and business insights.
        </p>
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap position-relative">
        {/* Refresh */}
        <motion.button
          onClick={onRefresh}
          className="btn-custom btn-secondary-custom py-2 px-3"
          disabled={loading}
          whileTap={{ scale: 0.96 }}
        >
          <FaSync className={`me-1.5 ${loading ? 'fa-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </motion.button>

        {/* Export CSV Dropdown */}
        <div className="position-relative">
          <motion.button
            onClick={() => setShowCsvMenu(!showCsvMenu)}
            className="btn-custom btn-secondary-custom py-2 px-3"
            whileTap={{ scale: 0.96 }}
          >
            <FaFileCsv className="me-1.5 text-success" />
            Export CSV
            <FaChevronDown size={10} className="ms-1 opacity-75" />
          </motion.button>

          {showCsvMenu && (
            <>
              <div
                className="position-fixed inset-0"
                style={{ zIndex: 998 }}
                onClick={() => setShowCsvMenu(false)}
              />
              <div
                className="position-absolute end-0 mt-1 bg-white border rounded-3 shadow-lg py-1 text-start"
                style={{ zIndex: 999, minWidth: '170px' }}
              >
                {csvOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => {
                      onExportCSV(opt.type);
                      setShowCsvMenu(false);
                    }}
                    className="dropdown-item py-2 px-3 text-small hover-bg-light"
                    style={{ border: 'none', background: 'none', width: '100%', display: 'block' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Export PDF */}
        <motion.button
          onClick={onExportPDF}
          className="btn-custom btn-primary-gradient py-2 px-3"
          whileTap={{ scale: 0.96 }}
        >
          <FaFilePdf className="me-1.5" />
          Export PDF
        </motion.button>
      </div>
    </div>
  );
}
