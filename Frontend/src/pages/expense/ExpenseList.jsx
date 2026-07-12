import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMoneyBillWave, FaThLarge, FaList, FaTrash, FaTimes } from 'react-icons/fa';
import { getAllExpenses, deleteExpense } from '../../services/expense.service.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import ExpenseCard from '../../components/expense/ExpenseCard.jsx';
import ExpenseTable from '../../components/expense/ExpenseTable.jsx';
import ExpenseFilter from '../../components/expense/ExpenseFilter.jsx';

/**
 * Expense Listing Directory page container.
 * @param {Object} props
 * @param {Function} props.onAddNew - Navigate to AddExpense screen.
 * @param {Function} props.onEdit - Navigate to EditExpense screen.
 */
export const ExpenseList = ({ onAddNew, onEdit }) => {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // View mode
  const [viewMode, setViewMode] = useState('grid');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const LIMIT = 8;

  // Delete dialog
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedVehicle, selectedType]);

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

  // Fetch expenses — useCallback prevents infinite render loop
  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: LIMIT };
      if (search.trim()) params.search = search.trim();
      if (selectedVehicle) params.vehicle = selectedVehicle;
      if (selectedType) params.expenseType = selectedType;

      const res = await getAllExpenses(params);
      if (res.success) {
        setExpenses(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
        setTotalExpenses(res.pagination?.total ?? res.data?.length ?? 0);
      } else {
        setError(res.message || 'Failed to retrieve expense directory');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedVehicle, selectedType]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleDeleteTrigger = (id) => setDeleteTargetId(id);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      const res = await deleteExpense(deleteTargetId);
      if (res.success) {
        setDeleteTargetId(null);
        loadExpenses();
      } else {
        alert(res.message || 'Failed to delete record');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Connection issue when deleting expense');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedVehicle('');
    setSelectedType('');
  };

  return (
    <div className="container-fluid py-4 px-md-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="mb-1 text-dark d-flex align-items-center gap-2">
            <FaMoneyBillWave className="text-primary" /> Fleet Expenses
          </h1>
          <p className="text-muted mb-0">Record, inspect, and analyze corporate fleet operational costs.</p>
        </div>
        <button onClick={onAddNew} className="btn-custom btn-primary-gradient shadow-sm">
          <FaPlus /> Log Fleet Expense
        </button>
      </div>

      {/* Filter Panel */}
      <ExpenseFilter
        searchVal={search}
        onSearchChange={setSearch}
        selectedVehicle={selectedVehicle}
        onVehicleChange={setSelectedVehicle}
        vehicles={vehicles}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
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
          Showing {expenses.length} of {totalExpenses} expenses
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
              <div className="card-solid p-4">
                <div className="skeleton-shimmer skeleton-box w-75 mb-3" style={{ height: '1.25rem' }}></div>
                <div className="skeleton-shimmer skeleton-box w-50 mb-3"></div>
                <div className="skeleton-shimmer skeleton-box w-100 mb-3"></div>
                <div className="skeleton-shimmer skeleton-box w-25"></div>
              </div>
            </div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-5 card-solid">
          <div className="d-inline-flex bg-light p-3 rounded-circle text-muted mb-3 fs-1">💵</div>
          <h3 className="mb-2">No expenses documented</h3>
          <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
            No expense records match your search criteria. Try modifying your filters or log a new expense.
          </p>
          <button onClick={onAddNew} className="btn-custom btn-secondary-custom">
            Log First Expense
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="row g-3">
          <AnimatePresence>
            {expenses.map((exp) => (
              <div key={exp._id} className="col-12 col-md-6 col-lg-3">
                <ExpenseCard
                  expense={exp}
                  onEdit={onEdit}
                  onDelete={handleDeleteTrigger}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <ExpenseTable
          expenses={expenses}
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
          <div className="modal-overlay-custom">
            <motion.div
              className="modal-content-custom"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="modal-header-custom bg-danger text-white">
                <h5 className="modal-title m-0 d-flex align-items-center gap-2">
                  <FaTrash /> Remove Expense?
                </h5>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.25rem', cursor: 'pointer' }}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body-custom">
                <p className="mb-0">
                  Are you certain you want to permanently remove this expense record? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer-custom">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="btn-custom btn-secondary-custom py-2"
                  disabled={isDeleting}
                >
                  Keep Expense
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="btn-custom btn-danger-custom py-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseList;
