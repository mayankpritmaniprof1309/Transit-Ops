import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileCsv } from 'react-icons/fa';
import { exportCSV } from '../../services/report.service.js';

/**
 * Reusable Export Button that downloads a CSV report from the backend.
 * @param {Object} props
 * @param {string} props.type - Ignored (always uses the CSV endpoint). Kept for API compatibility.
 * @param {Object} props.params - Query params passed to /reports/export/csv (type, startDate, endDate, vehicleId).
 * @param {string} props.label - Button text label.
 * @param {string} props.filename - Filename for the downloaded file (without extension).
 * @param {string} props.variant - Style variant: 'primary' | 'success' | 'secondary'
 */
export const ExportButton = ({
  type = 'csv',
  params = {},
  label = 'Export CSV',
  filename = 'report',
  variant = 'primary',
}) => {
  const [loading, setLoading] = useState(false);

  const variantClass = {
    primary: 'btn-primary-gradient',
    success: 'btn-secondary-custom',
    secondary: 'btn-secondary-custom',
  }[variant] || 'btn-primary-gradient';

  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await exportCSV(params);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV export failed:', err);
      alert('Export failed. The backend may not support this export type yet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleExport}
      disabled={loading}
      className={`btn-custom ${variantClass} d-inline-flex align-items-center gap-2`}
      whileTap={{ scale: 0.97 }}
      title={label}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          Exporting...
        </>
      ) : (
        <>
          <FaFileCsv /> {label}
        </>
      )}
    </motion.button>
  );
};

export default ExportButton;
