import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileDownload, FaFilePdf, FaFileCsv } from 'react-icons/fa';
import { exportCSV, exportPDF } from '../../services/report.service.js';

/**
 * Reusable Export Button component that downloads a CSV or PDF report.
 * @param {Object} props
 * @param {string} props.type - 'csv-expenses' | 'csv-fuel' | 'pdf'
 * @param {Object} props.params - Query params to pass to the export API.
 * @param {string} props.label - Button text label.
 * @param {string} props.filename - Filename for the downloaded file.
 * @param {string} props.variant - 'primary' | 'success' | 'danger' (default: 'primary')
 */
export const ExportButton = ({
  type = 'csv-expenses',
  params = {},
  label = 'Export',
  filename = 'report',
  variant = 'primary',
}) => {
  const [loading, setLoading] = useState(false);

  const variantClass = {
    primary: 'btn-primary-gradient',
    success: 'btn-custom btn-secondary-custom',
    danger: 'btn-danger-custom',
  }[variant] || 'btn-primary-gradient';

  const Icon = type === 'pdf' ? FaFilePdf : FaFileCsv;
  const extension = type === 'pdf' ? 'pdf' : 'csv';
  const mimeType = type === 'pdf' ? 'application/pdf' : 'text/csv';

  const handleExport = async () => {
    try {
      setLoading(true);
      let blob;

      if (type === 'pdf') {
        blob = await exportPDF(params);
      } else {
        // 'csv-expenses' -> 'expenses', 'csv-fuel' -> 'fuel'
        const reportType = type.replace('csv-', '');
        blob = await exportCSV(reportType, params);
      }

      // Trigger browser download
      const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. The server may not support this export endpoint yet.');
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
          <Icon /> {label}
        </>
      )}
    </motion.button>
  );
};

export default ExportButton;
