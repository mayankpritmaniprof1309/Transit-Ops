import React, { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import MaintenanceTable from '../../components/maintenance/MaintenanceTable';
import MaintenanceService from '../../services/maintenance.service';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { motion, AnimatePresence } from 'framer-motion';

const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    vehicle: '', 
    maintenanceType: '', 
    cost: '', 
    maintenanceStatus: 'Pending', 
    maintenanceDate: '' 
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDependencies();
  }, []);

  const loadDependencies = async () => {
    setLoading(true);
    try {
      const [maintenanceRes, vehiclesRes] = await Promise.all([
        MaintenanceService.getAllMaintenanceRecords(),
        getAllVehicles({ limit: 100 })
      ]);
      
      const maintenanceData = maintenanceRes.data || {};
      let mainRecs = [];
      if (Array.isArray(maintenanceData.maintenanceRecords)) {
        mainRecs = maintenanceData.maintenanceRecords;
      } else if (Array.isArray(maintenanceData)) {
        mainRecs = maintenanceData;
      }
      setRecords(mainRecs);
      
      if (vehiclesRes.success && vehiclesRes.data) {
        let vehRecs = [];
        if (Array.isArray(vehiclesRes.data.vehicles)) {
          vehRecs = vehiclesRes.data.vehicles;
        } else if (Array.isArray(vehiclesRes.data)) {
          vehRecs = vehiclesRes.data;
        }
        setVehicles(vehRecs);
      }
    } catch (error) {
      console.error("Error loading maintenance records", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance record?")) {
      try {
        await MaintenanceService.deleteMaintenanceRecord(id);
        setRecords(records.filter(r => (r._id || r.id) !== id));
      } catch (err) {
        alert("Failed to delete record: " + err.message);
      }
    }
  };

  const handleEdit = (record) => {
    const vehicleId = typeof record.vehicle === 'object' && record.vehicle ? record.vehicle._id : record.vehicle;
    setFormData({
      vehicle: vehicleId || '',
      maintenanceType: record.maintenanceType || record.type || '',
      cost: record.cost || '',
      maintenanceStatus: record.maintenanceStatus || record.status || 'Pending',
      maintenanceDate: record.maintenanceDate 
        ? new Date(record.maintenanceDate).toISOString().split('T')[0] 
        : (record.date || '')
    });
    setCurrentId(record._id || record.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({ vehicle: '', maintenanceType: '', cost: '', maintenanceStatus: 'Pending', maintenanceDate: '' });
    setIsEditMode(false);
    setCurrentId(null);
    setIsModalOpen(true);
  };

  // 1. Export Functionality
  const handleExport = () => {
    if (records.length === 0) return alert("No data to export");
    
    const headers = ['ID', 'Vehicle', 'Type', 'Date', 'Cost', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredRecords.map(r => {
        const vName = typeof r.vehicle === 'object' ? r.vehicle?.registrationNumber || r.vehicle?._id : r.vehicle;
        const id = r._id || r.id;
        const date = r.maintenanceDate ? new Date(r.maintenanceDate).toLocaleDateString() : r.date;
        const type = r.maintenanceType || r.type;
        const status = r.maintenanceStatus || r.status;
        return `${id},"${vName}","${type}",${date},${r.cost},${status}`;
      })
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

  // 2. Submit Functionality (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const response = await MaintenanceService.updateMaintenanceRecord(currentId, formData);
        setRecords(records.map(r => (r._id || r.id) === currentId ? response.data : r));
      } else {
        const response = await MaintenanceService.createMaintenanceRecord(formData);
        setRecords([...records, response.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving maintenance record", error);
      alert("Failed to save record: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = Array.isArray(records) ? records.filter(record => {
    const vName = (typeof record.vehicle === 'object' && record.vehicle 
      ? (record.vehicle.registrationNumber || record.vehicle.vehicleName || record.vehicle._id)
      : String(record.vehicle || '')).toLowerCase();
    
    const typeStr = (record.maintenanceType || record.type || '').toLowerCase();
    const matchSearch = vName.includes(searchTerm.toLowerCase()) || typeStr.includes(searchTerm.toLowerCase());
    
    const status = record.maintenanceStatus || record.status;
    const matchStatus = statusFilter === 'All' || status === statusFilter;
    
    return matchSearch && matchStatus;
  }) : [];

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
          <button className="btn-custom btn-primary-gradient shadow-sm" onClick={handleAddNew}>
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
        <MaintenanceTable records={filteredRecords} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop bg-dark"
              style={{ display: 'block', zIndex: 1040 }}
              onClick={() => setIsModalOpen(false)}
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
                    <h5 className="modal-title fw-bold">{isEditMode ? 'Edit' : 'Add'} Maintenance Record</h5>
                    <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Vehicle</label>
                        <select 
                          className="form-select" 
                          required 
                          value={formData.vehicle} 
                          onChange={e => setFormData({...formData, vehicle: e.target.value})}
                        >
                          <option value="">Select a Vehicle</option>
                          {vehicles.map(v => (
                            <option key={v._id} value={v._id}>
                              {v.registrationNumber} ({v.make} {v.model})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Maintenance Type</label>
                        <input type="text" className="form-control" required value={formData.maintenanceType} onChange={e => setFormData({...formData, maintenanceType: e.target.value})} placeholder="e.g. Oil Change" />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Cost ($)</label>
                          <input type="number" className="form-control" required value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} placeholder="0.00" min="0" step="0.01" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Date</label>
                          <input type="date" className="form-control" required value={formData.maintenanceDate} onChange={e => setFormData({...formData, maintenanceDate: e.target.value})} />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small">Status</label>
                        <select className="form-select" value={formData.maintenanceStatus} onChange={e => setFormData({...formData, maintenanceStatus: e.target.value})}>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn-custom btn-secondary-custom shadow-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-custom btn-primary-gradient shadow-sm" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Record')}
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
