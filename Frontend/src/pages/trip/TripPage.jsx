import React, { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import TripTable from '../../components/trip/TripTable';
import TripService from '../../services/trip.service';
import { motion, AnimatePresence } from 'framer-motion';

const TripPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ route: '', driver: '', vehicle: '', status: 'Scheduled', date: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await TripService.getAllTrips();
      setTrips(response.data);
    } catch (error) {
      console.error("Error loading trips", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      await TripService.deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
    }
  };

  // 1. Export Functionality
  const handleExport = () => {
    if (trips.length === 0) return alert("No data to export");
    
    // Define headers
    const headers = ['Trip ID', 'Route', 'Driver', 'Vehicle', 'Date', 'Status'];
    // Map data to rows
    const csvRows = [
      headers.join(','), // Header row
      ...filteredTrips.map(t => `${t.id},"${t.route}","${t.driver}","${t.vehicle}",${t.date},${t.status}`)
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trips_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Add Functionality
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await TripService.createTrip(newTrip);
      setTrips([...trips, response.data]);
      setIsAddModalOpen(false);
      setNewTrip({ route: '', driver: '', vehicle: '', status: 'Scheduled', date: '' });
    } catch (error) {
      console.error("Error creating trip", error);
      alert("Failed to add trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTrips = trips.filter(trip => 
    trip.route?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trip.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="page-container animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <h1 className="page-title">Trips Management</h1>
        <div className="d-flex gap-3">
          <button className="btn-premium-secondary" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          <button className="btn-premium-primary" onClick={() => setIsAddModalOpen(true)}>
            <FiPlus /> Add Trip
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
              placeholder="Search by route, driver, vehicle..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <button className="btn-premium-secondary">
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
        <TripTable trips={filteredTrips} onDelete={handleDelete} />
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
                    <h5 className="modal-title fw-bold">Add New Trip</h5>
                    <button type="button" className="btn-close" onClick={() => setIsAddModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddSubmit}>
                      <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Route</label>
                        <input type="text" className="form-control" required value={newTrip.route} onChange={e => setNewTrip({...newTrip, route: e.target.value})} placeholder="e.g. NY to Boston" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Driver</label>
                        <input type="text" className="form-control" required value={newTrip.driver} onChange={e => setNewTrip({...newTrip, driver: e.target.value})} placeholder="Driver Name" />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Vehicle</label>
                          <input type="text" className="form-control" required value={newTrip.vehicle} onChange={e => setNewTrip({...newTrip, vehicle: e.target.value})} placeholder="Vehicle ID" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Date</label>
                          <input type="date" className="form-control" required value={newTrip.date} onChange={e => setNewTrip({...newTrip, date: e.target.value})} />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small">Status</label>
                        <select className="form-select" value={newTrip.status} onChange={e => setNewTrip({...newTrip, status: e.target.value})}>
                          <option>Scheduled</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn-premium-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-premium-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Adding...' : 'Add Trip'}
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

export default TripPage;
