import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTh, FaList, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { getAllVehicles, deleteVehicle } from '../../services/vehicle.service.js';
import VehicleCard from '../../components/vehicle/VehicleCard.jsx';
import VehicleTable from '../../components/vehicle/VehicleTable.jsx';
import VehicleFilter from '../../components/vehicle/VehicleFilter.jsx';
import VehicleDetails from '../../components/vehicle/VehicleDetails.jsx';

export const VehicleList = ({ onAddNew, onEdit, onView }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Views: 'grid' | 'table'
  const [viewMode, setViewMode] = useState('grid');

  // Search & Filter States
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
  });

  // Pagination States
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 8,
  });

  // Details & Delete Confirmation states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deletingVehicleId, setDeletingVehicleId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data from backend service
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = {
        page: pagination.currentPage,
        limit: viewMode === 'grid' ? 8 : 10, // Grid looks best with 8 items, Table with 10
        search: filters.search,
        status: filters.status,
        type: filters.type,
      };

      const res = await getAllVehicles(queryParams);
      if (res.success) {
        setVehicles(res.data.vehicles || res.data.vehicleRecords || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
        }));
      } else {
        setError(res.message || 'Failed to fetch vehicles');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [pagination.currentPage, filters.search, filters.status, filters.type, viewMode]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle Delete Action
  const handleDeleteConfirm = async () => {
    if (!deletingVehicleId) return;
    try {
      setIsDeleting(true);
      const res = await deleteVehicle(deletingVehicleId);
      if (res.success) {
        setVehicles((prev) => prev.filter((v) => v._id !== deletingVehicleId));
        setDeletingVehicleId(null);
        fetchVehicles(); // Reload to sync pagination details
      } else {
        alert(res.message || 'Delete operation failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred while deleting vehicle');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Header Panel */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Fleet Management</h1>
          <p className="text-muted mb-0">Track, configure, and manage active operations vehicles.</p>
        </div>
        <button
          onClick={onAddNew}
          className="btn-custom btn-primary-gradient shadow-sm"
        >
          <FaPlus /> Register Vehicle
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger border-0 rounded-3 mb-4 shadow-sm" role="alert">
          {error}
        </div>
      )}

      {/* Filter Component */}
      <VehicleFilter filters={filters} onFilterChange={setFilters} />

      {/* View Switcher & Counter */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-small text-muted fw-semibold">
          Showing {vehicles.length} of {pagination.totalRecords} registered vehicles
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
      ) : vehicles.length === 0 ? (
        // Empty State card
        <div className="card-solid text-center py-5 shadow-sm">
          <div className="display-4 text-muted mb-3">🚚</div>
          <h3>No Fleet Vehicles Found</h3>
          <p className="text-muted maxWidth-500 mx-auto">
            Try adjusting search keys or status filters.
          </p>
          <button
            onClick={() => {
              setFilters({ search: '', status: '', type: '' });
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
          {vehicles.map((vehicle) => (
            <div className="col-sm-6 col-md-4 col-xl-3" key={vehicle._id}>
              <VehicleCard
                vehicle={vehicle}
                onView={onView || setSelectedVehicle}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      ) : (
        // Table Display
        <VehicleTable
          vehicles={vehicles}
          onView={onView || setSelectedVehicle}
          onEdit={onEdit}
          onDelete={setDeletingVehicleId}
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
        {selectedVehicle && (
          <VehicleDetails
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingVehicleId && (
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
                  <h4 className="mb-0">Delete Fleet Vehicle</h4>
                </div>
              </div>
              <div className="modal-body-custom">
                <p>Are you sure you want to remove this vehicle from your fleet index? This action is irreversible.</p>
              </div>
              <div className="modal-footer-custom">
                <button
                  onClick={() => setDeletingVehicleId(null)}
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

export default VehicleList;
