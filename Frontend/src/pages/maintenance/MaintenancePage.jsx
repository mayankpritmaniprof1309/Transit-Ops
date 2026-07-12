import React, { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import MaintenanceTable from '../../components/maintenance/MaintenanceTable';
import MaintenanceService from '../../services/maintenance.service';
import { motion, AnimatePresence } from 'framer-motion';

const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({ vehicle: '', type: '', cost: '', status: 'Pending', date: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await MaintenanceService.getAllMaintenanceRecords();
      setRecords(response.data);
    } catch (error) {
      console.error("Error loading maintenance records", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance record?")) {
      await MaintenanceService.deleteMaintenanceRecord(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  // 1. Export Functionality
  const handleExport = () => {
    if (records.length === 0) return alert("No data to export");
    
    const headers = ['ID', 'Vehicle', 'Type', 'Date', 'Cost', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredRecords.map(r => `${r.id},"${r.vehicle}","${r.type}",${r.date},${r.cost},${r.status}`)
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `maintenance_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Add Functionality
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await MaintenanceService.createMaintenanceRecord(newRecord);
      setRecords([...records, response.data]);
      setIsAddModalOpen(false);
      setNewRecord({ vehicle: '', type: '', cost: '', status: 'Pending', date: '' });
    } catch (error) {
      console.error("Error creating maintenance record", error);
      alert("Failed to add record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = records.filter(record => 
    (record.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.type?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'All' || record.status === statusFilter)
  );

  return (
    <motion.div 
      className="page-container animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <h1 className="page-title">Maintenance Records</h1>
        <div className="d-flex gap-3">
          <button className="btn-custom btn-secondary-custom shadow-sm" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          <button className="btn-custom btn-primary-gradient shadow-sm" onClick={() => setIsAddModalOpen(true)}>
            <FiPlus /> Add Record
          </button>
        </div>
      </div>

      <div className="premium-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="search-icon-wrapper w-50">
            <FiSearch className="search-icon" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input 
              type="text" 
              className="form-control" 
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
              placeholder="Search by vehicle or type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="form-select text-secondary fw-semibold" 
              style={{ borderRadius: '12px', minWidth: '160px', padding: '0.55rem 1.2rem', borderColor: 'rgba(100, 116, 139, 0.22)' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="premium-card p-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <MaintenanceTable records={filteredRecords} onDelete={handleDelete} />
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop bg-dark"
              style={{ display: 'block', zIndex: 1040 }}
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="modal d-block" 
              tabIndex="-1"
              style={{ zIndex: 1050 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content premium-card border-0 p-0">
                  <div className="modal-header border-bottom-0 pb-0">
                    <h5 className="modal-title fw-bold">Add Maintenance Record</h5>
                    <button type="button" className="btn-close" onClick={() => setIsAddModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddSubmit}>
                      <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Vehicle ID</label>
                        <input type="text" className="form-control" required value={newRecord.vehicle} onChange={e => setNewRecord({...newRecord, vehicle: e.target.value})} placeholder="e.g. Truck-001" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Maintenance Type</label>
                        <input type="text" className="form-control" required value={newRecord.type} onChange={e => setNewRecord({...newRecord, type: e.target.value})} placeholder="e.g. Oil Change" />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Cost ($)</label>
                          <input type="number" className="form-control" required value={newRecord.cost} onChange={e => setNewRecord({...newRecord, cost: e.target.value})} placeholder="0.00" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Date</label>
                          <input type="date" className="form-control" required value={newRecord.date} onChange={e => setNewRecord({...newRecord, date: e.target.value})} />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small">Status</label>
                        <select className="form-select" value={newRecord.status} onChange={e => setNewRecord({...newRecord, status: e.target.value})}>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn-custom btn-secondary-custom shadow-sm" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-custom btn-primary-gradient shadow-sm" disabled={isSubmitting}>
                          {isSubmitting ? 'Adding...' : 'Add Record'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MaintenancePage;
