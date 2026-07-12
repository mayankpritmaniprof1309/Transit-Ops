import React, { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiSearch, FiFilter } from 'react-icons/fi';
import MaintenanceTable from '../../components/maintenance/MaintenanceTable';
import MaintenanceService from '../../services/maintenance.service';
import { motion } from 'framer-motion';

const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRecords = records.filter(record => 
    record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
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
          <button className="btn-secondary-soft">
            <FiDownload /> Export
          </button>
          <button className="btn-primary-gradient">
            <FiPlus /> Add Record
          </button>
        </div>
      </div>

      <div className="premium-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="search-icon-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search by vehicle or type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <button className="btn-secondary-soft">
              <FiFilter /> Filters
            </button>
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
    </motion.div>
  );
};

export default MaintenancePage;
