import React from 'react';
import { FaFileCsv, FaDownload, FaFilePdf, FaPrint } from 'react-icons/fa';

export default function AnalyticsExport({ onExportCSV, onExportPDF }) {
  const exportCards = [
    { title: 'Trips Report', type: 'trips', desc: 'Download logs including cargo weight, actual distance, expected revenue, and status.' },
    { title: 'Vehicles Report', type: 'vehicles', desc: 'Download complete listing of registration keys, model status, and acquisition valuations.' },
    { title: 'Drivers Report', type: 'drivers', desc: 'Download driver roster containing safety ratings, contact emails, and license dates.' },
    { title: 'Expenses Report', type: 'expenses', desc: 'Download breakdown containing amounts, methods, vehicles, and transaction descriptions.' },
    { title: 'Fuel Logs Report', type: 'fuel_logs', desc: 'Download refueling records including liters, station locations, odometer readings, and costs.' },
  ];

  return (
    <div className="premium-card bg-white p-4 border shadow-sm no-print">
      <h5 className="fw-bold text-dark mb-1">Data Export Center</h5>
      <p className="text-secondary small mb-4">Download localized datasets in standard format for offline spreadsheet processing and BI integrations.</p>

      <div className="row g-3">
        {exportCards.map((card) => (
          <div key={card.type} className="col-12 col-md-6 col-lg-4">
            <div className="card border-light bg-light bg-opacity-50 p-3 rounded-3 d-flex flex-column justify-content-between h-100 transition-all hover-shadow-sm">
              <div>
                <span className="fw-bold text-dark d-block mb-1" style={{ fontSize: '0.9rem' }}>{card.title}</span>
                <p className="text-secondary mb-3" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>{card.desc}</p>
              </div>
              <button
                onClick={() => onExportCSV(card.type)}
                className="btn btn-sm btn-light border d-flex align-items-center justify-content-center gap-1.5 fw-semibold text-secondary w-100 py-2 rounded-2 mt-auto"
                style={{ fontSize: '0.78rem' }}
              >
                <FaFileCsv className="text-success" />
                Download CSV
                <FaDownload size={10} className="ms-auto opacity-75" />
              </button>
            </div>
          </div>
        ))}

        {/* Print / PDF Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-primary border-opacity-25 bg-primary bg-opacity-5 p-3 rounded-3 d-flex flex-column justify-content-between h-100 transition-all hover-shadow-sm">
            <div>
              <span className="fw-bold text-primary d-block mb-1" style={{ fontSize: '0.9rem' }}>Print Executive Briefing</span>
              <p className="text-secondary mb-3" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>Generate a complete, high-fidelity PDF print layout including all active filters, KPI summaries, and charts.</p>
            </div>
            <button
              onClick={onExportPDF}
              className="btn btn-sm btn-primary-gradient d-flex align-items-center justify-content-center gap-1.5 fw-semibold text-white w-100 py-2 rounded-2 mt-auto"
              style={{ fontSize: '0.78rem' }}
            >
              <FaFilePdf />
              Print Report
              <FaPrint size={10} className="ms-auto opacity-75" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
