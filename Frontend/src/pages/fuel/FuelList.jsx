import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaGasPump, FaThLarge, FaList, FaTrash, FaTimes } from 'react-icons/fa';
import { getAllFuelLogs, deleteFuelLog } from '../../services/fuel.service.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import FuelCard from '../../components/fuel/FuelCard.jsx';
import FuelTable from '../../components/fuel/FuelTable.jsx';
import FuelFilter from '../../components/fuel/FuelFilter.jsx';

/**
 * FuelLog Listing Directory page container.
 * @param {Object} props
 * @param {Function} props.onAddNew - Navigate to AddFuel screen.
 * @param {Function} props.onEdit - Navigate to EditFuel screen.
 */
export const FuelList = ({ onAddNew, onEdit }) => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // View mode
  const [viewMode, setViewMode] = useState('grid');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const LIMIT = 8;

  // Delete dialog
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedVehicle, dateFrom, dateTo]);

  // Load vehicles for filter dropdown
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await getAllVehicles();
        if (res.success) setVehicles(res.data || []);
      } catch (err) {
        console.error('Failed to load filter vehicles:', err);
      }
    };
    loadVehicles();
  }, []);

  // Fetch fuel logs — useCallback prevents infinite loop
  const loadFuelLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: LIMIT };
      if (search.trim()) params.search = search.trim();
      if (selectedVehicle) params.vehicle = selectedVehicle;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await getAllFuelLogs(params);
      if (res.success) {
        setLogs(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
        setTotalLogs(res.pagination?.total ?? res.data?.length ?? 0);
      } else {
        setError(res.message || 'Failed to retrieve fuel log directory');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedVehicle, dateFrom, dateTo]);

  useEffect(() => {
    loadFuelLogs();
  }, [loadFuelLogs]);

  const handleDeleteTrigger = (id) => setDeleteTargetId(id);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      const res = await deleteFuelLog(deleteTargetId);
      if (res.success) {
        setDeleteTargetId(null);
        loadFuelLogs();
      } else {
        alert(res.message || 'Failed to delete record');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Connection issue when deleting log');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedVehicle('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="mb-1 text-dark d-flex align-items-center gap-2">
            <FaGasPump className="text-primary" /> Fuel Logs
          </h1>
          <p className="text-muted mb-0">Record, inspect, and analyze vehicle refueling activities.</p>
        </div>
        <button onClick={onAddNew} className="btn-premium-primary shadow-sm">
          <FaPlus /> Record Fuel Purchase
        </button>
      </div>

      {/* Filter Panel */}
      <FuelFilter
        searchVal={search}
        onSearchChange={setSearch}
        selectedVehicle={selectedVehicle}
        onVehicleChange={setSelectedVehicle}
        vehicles={vehicles}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClearFilters={handleClearFilters}
      />

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm" role="alert">
          {error}
        </div>
      )}

      {/* View Switch & Count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-small text-muted fw-semibold">
          Showing {logs.length} of {totalLogs} logs
        </span>
        <div className="d-flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`pagination-item ${viewMode === 'grid' ? 'active' : ''}`}
            title="Grid view"
            style={{ width: '34px', height: '34px' }}
          >
            <FaThLarge size={13} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`pagination-item ${viewMode === 'table' ? 'active' : ''}`}
            title="Table view"
            style={{ width: '34px', height: '34px' }}
          >
            <FaList size={13} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="row g-3">
          {[...Array(LIMIT)].map((_, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className="premium-card p-4 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-5 premium-card">
          <div className="d-inline-flex bg-light p-3 rounded-circle text-muted mb-3 fs-1">⛽</div>
          <h3 className="mb-2">No refueling logs found</h3>
          <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
            No purchase records match your search criteria. Try modifying your filters or insert a new fuel log.
          </p>
          <button onClick={onAddNew} className="btn-premium-secondary">
            Log First Purchase
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="row g-3">
          <AnimatePresence>
            {logs.map((log) => (
              <div key={log._id} className="col-12 col-md-6 col-lg-3">
                <FuelCard
                  fuelLog={log}
                  onEdit={onEdit}
                  onDelete={handleDeleteTrigger}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <FuelTable
          fuelLogs={logs}
          onEdit={onEdit}
          onDelete={handleDeleteTrigger}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <div className="pagination-custom">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="pagination-item"
            >
              &laquo;
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`pagination-item ${page === idx + 1 ? 'active' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="pagination-item"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetId && (
          <>
            <motion.div
              className="modal-backdrop bg-dark"
              style={{ display: 'block', zIndex: 1040, opacity: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetId(null)}
            />
            <motion.div
              className="modal d-block"
              style={{ zIndex: 1050 }}
              initial={{ scale: 0.95, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -50 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content premium-card border-0 p-0">
                  <div className="modal-header border-bottom-0 pb-0">
                    <h5 className="modal-title m-0 d-flex align-items-center gap-2 text-danger fw-bold">
                      <FaTrash /> Remove Fuel Log?
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setDeleteTargetId(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p className="mb-0">
                      Are you certain you want to permanently discard this fuel purchase record? This action cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer border-top-0 pt-0 justify-content-end gap-2">
                    <button
                      onClick={() => setDeleteTargetId(null)}
                      className="btn-premium-secondary py-2"
                      disabled={isDeleting}
                    >
                      Keep Log
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="btn-premium-danger py-2"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FuelList;
