import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTh, FaList, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { getAllDrivers, deleteDriver } from '../../services/driver.service.js';
import DriverCard from '../../components/driver/DriverCard.jsx';
import DriverTable from '../../components/driver/DriverTable.jsx';
import DriverFilter from '../../components/driver/DriverFilter.jsx';
import DriverDetails from '../../components/driver/DriverDetails.jsx';

export const DriverList = ({ onAddNew, onEdit, onView }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Views: 'grid' | 'table'
  const [viewMode, setViewMode] = useState('grid');

  // Search & Filter States
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  // Pagination States
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 8,
  });

  // Details & Delete Confirmation states
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deletingDriverId, setDeletingDriverId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data from backend service
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = {
        page: pagination.currentPage,
        limit: viewMode === 'grid' ? 8 : 10,
        search: filters.search,
        status: filters.status,
      };

      const res = await getAllDrivers(queryParams);
      if (res.success) {
        // Standardize output shape
        setDrivers(res.data.drivers || res.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1,
          totalRecords: res.data.totalRecords || (res.data.drivers ? res.data.drivers.length : res.data.length || 0),
        }));
      } else {
        setError(res.message || 'Failed to fetch drivers list');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [pagination.currentPage, filters.search, filters.status, viewMode]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle Delete/Suspend Action
  const handleDeleteConfirm = async () => {
    if (!deletingDriverId) return;
    try {
      setIsDeleting(true);
      const res = await deleteDriver(deletingDriverId);
      if (res.success) {
        setDrivers((prev) => prev.filter((d) => d._id !== deletingDriverId));
        setDeletingDriverId(null);
        fetchDrivers(); // Reload to sync stats
      } else {
        alert(res.message || 'Delete operation failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred while deleting driver');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Header Panel */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Driver Directory</h1>
          <p className="text-muted mb-0">Monitor logs, verify categories, and manage driver portfolios.</p>
        </div>
        <button
          onClick={onAddNew}
          className="btn-custom btn-primary-gradient shadow-sm"
        >
          <FaPlus /> Enroll Driver
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm" role="alert">
          {error}
        </div>
      )}

      {/* Filter Component */}
      <DriverFilter filters={filters} onFilterChange={setFilters} />

      {/* View Switcher & Counter */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-small text-muted fw-semibold">
          Showing {drivers.length} of {pagination.totalRecords} enrolled drivers
        </span>
        <div className="d-inline-flex border rounded bg-white p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`btn btn-sm border-0 px-3 py-1 ${viewMode === 'grid' ? 'btn-primary-gradient text-white' : 'btn-light text-muted'}`}
            style={{ borderRadius: '12px' }}
          >
            <FaTh className="me-1" /> Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`btn btn-sm border-0 px-3 py-1 ${viewMode === 'table' ? 'btn-primary-gradient text-white' : 'btn-light text-muted'}`}
            style={{ borderRadius: '12px' }}
          >
            <FaList className="me-1" /> Table
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        // Loader Shimmers
        <div className="row g-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div className="col-md-3" key={idx}>
              <div className="card-solid p-4">
                <div className="skeleton-shimmer skeleton-box w-50 mb-3"></div>
                <div className="skeleton-shimmer skeleton-box w-75 mb-3" style={{ height: '2rem' }}></div>
                <div className="skeleton-shimmer skeleton-box w-100 mb-4"></div>
                <div className="skeleton-shimmer skeleton-box w-100" style={{ height: '2.5rem', borderRadius: '18px' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : drivers.length === 0 ? (
        // Empty State card
        <div className="card-solid text-center py-5 shadow-sm">
          <div className="display-4 text-muted mb-3">👤</div>
          <h3>No Drivers Found</h3>
          <p className="text-muted maxWidth-500 mx-auto">
            Try adjusting search keys or duty status filters.
          </p>
          <button
            onClick={() => {
              setFilters({ search: '', status: '' });
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="btn-custom btn-secondary-custom mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid Display
        <div className="row g-4">
          {drivers.map((driver) => (
            <div className="col-sm-6 col-md-4 col-xl-3" key={driver._id}>
              <DriverCard
                driver={driver}
                onView={onView || setSelectedDriver}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      ) : (
        // Table Display
        <DriverTable
          drivers={drivers}
          onView={onView || setSelectedDriver}
          onEdit={onEdit}
          onDelete={setDeletingDriverId}
        />
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && !loading && (
        <div className="d-flex justify-content-center mt-5">
          <div className="pagination-custom">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="pagination-item"
            >
              &laquo;
            </button>
            {Array.from({ length: pagination.totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`pagination-item ${pagination.currentPage === idx + 1 ? 'active' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="pagination-item"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}

      {/* View Modal overlay fallback (if onView is not overriding) */}
      <AnimatePresence>
        {selectedDriver && (
          <DriverDetails
            driver={selectedDriver}
            onClose={() => setSelectedDriver(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingDriverId && (
          <div className="modal-overlay-custom">
            <motion.div
              className="modal-content-custom"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="modal-header-custom bg-danger-light text-danger">
                <div className="d-flex align-items-center gap-2">
                  <FaExclamationTriangle />
                  <h4 className="mb-0">Delete Driver Profile</h4>
                </div>
              </div>
              <div className="modal-body-custom">
                <p>Are you sure you want to permanently remove this driver profile? This will revoke access and clear history records.</p>
              </div>
              <div className="modal-footer-custom">
                <button
                  onClick={() => setDeletingDriverId(null)}
                  disabled={isDeleting}
                  className="btn-custom btn-secondary-custom"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="btn-custom btn-danger-custom d-flex align-items-center gap-2 px-4"
                >
                  <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverList;
