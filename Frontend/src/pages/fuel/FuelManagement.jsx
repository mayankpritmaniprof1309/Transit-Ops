import React, { useState, useEffect } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FuelStats from '../../components/fuel/FuelStats.jsx';
import FuelFilters from '../../components/fuel/FuelFilters.jsx';
import FuelTable from '../../components/fuel/FuelTable.jsx';
import FuelForm from '../../components/fuel/FuelForm.jsx';
import Loader from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

// Import service calls
import * as fuelService from '../../services/fuel.service.js';

export default function FuelManagement() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & Sorting state
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter state
  const [activeFilters, setActiveFilters] = useState({});

  // Modals / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'danger'

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Load fuel logs
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...activeFilters,
      };

      // Call API
      const res = await fuelService.getAllFuelLogs(params);

      if (res.success) {
        setLogs(res.data?.fuelLogs || []);
        setTotalRecords(res.data?.totalRecords || 0);
        setTotalPages(res.data?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load refueling logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, sortBy, sortOrder, activeFilters]);

  // Handle Sort Change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  // Filter handlers
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setPage(1);
  };

  const handleResetFilters = (cleared) => {
    setActiveFilters(cleared);
    setPage(1);
  };

  // Form submit handler
  const handleFormSave = async (formData) => {
    setLoading(true);
    try {
      if (selectedLog) {
        // Edit Mode
        const res = await fuelService.updateFuelLog(selectedLog._id, formData);
        if (res.success) {
          showToast('Refueling purchase log updated successfully.');
        }
      } else {
        // Create Mode
        const res = await fuelService.createFuelLog(formData);
        if (res.success) {
          showToast('New refueling purchase logged successfully.');
        }
      }
      setIsFormOpen(false);
      setSelectedLog(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to log refueling transaction.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Delete submit handler
  const handleDeleteConfirm = async () => {
    if (!logToDelete) return;
    setLoading(true);
    try {
      const res = await fuelService.deleteFuelLog(logToDelete);
      if (res.success) {
        showToast('Refueling log item deleted successfully.');
      }
      setLogToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Delete operation failed.', 'danger');
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  if (error) {
    return <ErrorState title="Error Loading Refuels" message={error} onRetry={loadData} />;
  }

  return (
    <div className="container-fluid px-0 py-2">
      {/* Toast alert banner */}
      {toastMessage && (
        <div
          className={`position-fixed top-0 end-0 m-4 alert alert-${toastType} border-0 shadow-lg py-2.5 px-4 rounded-3`}
          style={{ zIndex: 1100, minWidth: '280px' }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header Panel */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small text-muted">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-decoration-none text-secondary">Dashboard</a>
              </li>
              <li className="breadcrumb-item active text-dark fw-medium" aria-current="page">
                Fuel Logs
              </li>
            </ol>
          </nav>
          <h2 className="fw-extrabold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>Fuel Logs</h2>
          <p className="text-secondary mb-0">Record, track, and monitor refueling purchases and efficiency indices.</p>
        </div>

        <button
          onClick={() => {
            setSelectedLog(null);
            setIsFormOpen(true);
          }}
          className="btn btn-premium-primary d-flex align-items-center gap-2 px-4 py-2.5"
        >
          <FaPlus size={13} /> Record Refuel
        </button>
      </div>

      {/* Stats Summary Panel (pass full logs list for client side aggregation) */}
      <FuelStats logs={logs} />

      {/* Filter Options */}
      <FuelFilters onFilterChange={handleFilterChange} onReset={handleResetFilters} />

      {/* Main Fuel Table */}
      {loading && logs.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Loader />
        </div>
      ) : (
        <>
          <FuelTable
            logs={logs}
            onEdit={(log) => {
              setSelectedLog(log);
              setIsFormOpen(true);
            }}
            onDelete={(id) => {
              setLogToDelete(id);
              setIsDeleteOpen(true);
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Table Pagination footer */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="small text-secondary">
                Showing page <strong className="text-dark">{page}</strong> of <strong className="text-dark">{totalPages}</strong> ({totalRecords} records)
              </span>
              <div className="d-flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  className="btn btn-premium-secondary px-3 py-2 d-flex align-items-center gap-1"
                >
                  <FaChevronLeft size={10} /> Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  className="btn btn-premium-secondary px-3 py-2 d-flex align-items-center gap-1"
                >
                  Next <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Form Modal Dialog sheet */}
      {isFormOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-40"
            style={{ zIndex: 1080 }}
            onClick={() => setIsFormOpen(false)}
          />
          <div
            className="position-fixed top-50 start-50 translate-middle w-100 p-3"
            style={{ zIndex: 1090, maxWidth: '600px' }}
          >
            <div className="card border-0 shadow-lg p-4 rounded-4 bg-white">
              <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">
                {selectedLog ? 'Edit Refueling Purchase Log' : 'Record Refueling Purchase Log'}
              </h5>
              <FuelForm
                log={selectedLog}
                onSave={handleFormSave}
                onCancel={() => setIsFormOpen(false)}
                loading={loading}
              />
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Fuel Log?"
        message="Are you sure you want to permanently delete this refueling purchase record? This operation is irreversible."
        confirmText="Delete Log"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
}
