import React, { useState, useEffect } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ExpenseStats from '../../components/expense/ExpenseStats.jsx';
import ExpenseFilters from '../../components/expense/ExpenseFilters.jsx';
import ExpenseTable from '../../components/expense/ExpenseTable.jsx';
import ExpenseForm from '../../components/expense/ExpenseForm.jsx';
import Loader from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';

// Import service calls
import * as expenseService from '../../services/expense.service.js';

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & Sorting state
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('Newest');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter state
  const [activeFilters, setActiveFilters] = useState({});

  // Modals / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'danger'

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Load expenses & stats
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        sortBy,
        ...activeFilters,
      };

      // Call API
      const [listRes, statsRes] = await Promise.all([
        expenseService.getAllExpenses(params),
        expenseService.getExpenseStats(),
      ]);

      if (listRes.success) {
        setExpenses(listRes.data?.expenses || []);
        setTotalRecords(listRes.data?.totalRecords || 0);
        setTotalPages(listRes.data?.totalPages || 1);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load expense records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, sortBy, activeFilters]);

  // Handle Sort Change
  const handleSortChange = (field) => {
    if (field === 'amount') {
      setSortBy(sortBy === 'Highest Amount' ? 'Lowest Amount' : 'Highest Amount');
    } else if (field === 'expenseDate') {
      setSortBy(sortBy === 'Newest' ? 'Oldest' : 'Newest');
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
      if (selectedExpense) {
        // Edit Mode
        const res = await expenseService.updateExpense(selectedExpense._id, formData);
        if (res.success) {
          showToast('Expense record updated successfully.');
        }
      } else {
        // Create Mode
        const res = await expenseService.createExpense(formData);
        if (res.success) {
          showToast('New expense recorded successfully.');
        }
      }
      setIsFormOpen(false);
      setSelectedExpense(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Action execution failed.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Delete submit handler
  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setLoading(true);
    try {
      const res = await expenseService.deleteExpense(expenseToDelete);
      if (res.success) {
        showToast('Expense log deleted successfully.');
      }
      setExpenseToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Delete operation failed.', 'danger');
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  if (error) {
    return <ErrorState title="Error Loading Expenses" message={error} onRetry={loadData} />;
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
                Expenses
              </li>
            </ol>
          </nav>
          <h2 className="fw-extrabold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>Expenses</h2>
          <p className="text-secondary mb-0">Record, filter, and track operation budgets and fuel expenses.</p>
        </div>

        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsFormOpen(true);
          }}
          className="btn btn-premium-primary d-flex align-items-center gap-2 px-4 py-2.5"
        >
          <FaPlus size={13} /> Record Expense
        </button>
      </div>

      {/* Stats Summary Panel */}
      <ExpenseStats stats={stats} />

      {/* Filter Options */}
      <ExpenseFilters onFilterChange={handleFilterChange} onReset={handleResetFilters} />

      {/* Main Expenses Table */}
      {loading && expenses.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Loader />
        </div>
      ) : (
        <>
          <ExpenseTable
            expenses={expenses}
            onEdit={(exp) => {
              setSelectedExpense(exp);
              setIsFormOpen(true);
            }}
            onDelete={(id) => {
              setExpenseToDelete(id);
              setIsDeleteOpen(true);
            }}
            sortBy={sortBy === 'Newest' || sortBy === 'Oldest' ? 'expenseDate' : 'amount'}
            sortOrder={sortBy === 'Newest' || sortBy === 'Highest Amount' ? 'desc' : 'asc'}
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
                {selectedExpense ? 'Edit Expense Record' : 'Record New Expense'}
              </h5>
              <ExpenseForm
                expense={selectedExpense}
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
        title="Delete Expense Log?"
        message="Are you sure you want to permanently delete this expense log? This operation cannot be reversed."
        confirmText="Delete Record"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
}
