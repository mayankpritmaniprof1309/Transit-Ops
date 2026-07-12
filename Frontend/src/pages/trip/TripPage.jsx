import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiDownload, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import TripTable from '../../components/trip/TripTable';
import TripService from '../../services/trip.service';
import { getAllDrivers } from '../../services/driver.service.js';
import { getAllVehicles } from '../../services/vehicle.service.js';
import { motion, AnimatePresence } from 'framer-motion';

const TripPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ route: '', driver: '', vehicle: '', status: 'Scheduled', date: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);

  // Searchable Drivers Dropdown State
  const [drivers, setDrivers] = useState([]);
  const [driverSearch, setDriverSearch] = useState('');
  const [isDriverDropdownOpen, setIsDriverDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Searchable Vehicles Dropdown State
  const [vehicles, setVehicles] = useState([]);
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const vehicleDropdownRef = useRef(null);

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (isAddModalOpen) {
      loadDrivers();
      loadVehicles();
    }
  }, [isAddModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDriverDropdownOpen(false);
      }
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target)) {
        setIsVehicleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDrivers = async () => {
    try {
      const res = await getAllDrivers();
      if (res.success) {
        setDrivers(res.data.drivers || res.data || []);
      }
    } catch (error) {
      console.error("Error loading drivers", error);
    }
  };

  const loadVehicles = async () => {
    try {
      const res = await getAllVehicles({ limit: 100 });
      if (res.success) {
        setVehicles(res.data.vehicles || res.data || []);
      }
    } catch (error) {
      console.error("Error loading vehicles", error);
    }
  };

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await TripService.getAllTrips();
      if (response.success) {
        setTrips(response.data.trips || response.data || []);
      } else {
        setTrips(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Error loading trips", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      await TripService.deleteTrip(id);
      setTrips(trips.filter(t => t._id !== id));
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
      ...filteredTrips.map(t => `${t._id || t.tripNumber},"${t.source} to ${t.destination}","${t.driver?.fullName || 'Unknown'}","${t.vehicle?.registrationNumber || 'Unknown'}",${t.dispatchDate || t.createdAt},${t.tripStatus || t.status}`)
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        source: newTrip.route.split(' to ')[0] || newTrip.route,
        destination: newTrip.route.split(' to ')[1] || 'Unknown',
        vehicle: newTrip.vehicleId,
        driver: newTrip.driverId,
        tripStatus: newTrip.status,
        dispatchDate: newTrip.date || undefined
      };

      if (editingTripId) {
        const response = await TripService.updateTrip(editingTripId, payload);
        // Refresh full trip list since populated driver/vehicle info is returned or we just reload
        loadTrips();
      } else {
        // Add create-only required fields
        payload.tripNumber = `TRP-${Math.floor(Math.random() * 90000) + 10000}`;
        payload.cargoWeight = 5000;
        payload.plannedDistance = 100;
        const response = await TripService.createTrip(payload);
        loadTrips();
      }
      setIsAddModalOpen(false);
      setEditingTripId(null);
      setNewTrip({ route: '', driver: '', driverId: null, vehicle: '', vehicleId: null, status: 'Scheduled', date: '' });
    } catch (error) {
      console.error("Error saving trip", error);
      alert("Failed to save trip. Check required fields or validation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (trip) => {
    setNewTrip({
      route: trip.route || `${trip.source} to ${trip.destination}`,
      driver: trip.driver?.fullName || trip.driver,
      driverId: trip.driver?._id || trip.driver,
      vehicle: trip.vehicle?.registrationNumber || trip.vehicle,
      vehicleId: trip.vehicle?._id || trip.vehicle,
      status: trip.tripStatus || trip.status,
      date: trip.dispatchDate ? new Date(trip.dispatchDate).toISOString().split('T')[0] : trip.date,
    });
    setEditingTripId(trip._id);
    setIsAddModalOpen(true);
  };

  const filteredTrips = trips.filter(trip => {
    const route = trip.route || `${trip.source} to ${trip.destination}` || '';
    const driverName = trip.driver?.fullName || trip.driver || '';
    const vehicleName = trip.vehicle?.registrationNumber || trip.vehicle || '';
    const status = trip.tripStatus || trip.status || '';

    return (
      (route.toLowerCase().includes(searchTerm.toLowerCase()) || 
       driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       vehicleName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || status === statusFilter)
    );
  });

  const filteredDrivers = drivers.filter(d => 
    (d.fullName || d.name || '').toLowerCase().includes(driverSearch.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(v => 
    (v.registrationNumber || v.vehicleName || '').toLowerCase().includes(vehicleSearch.toLowerCase())
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
          <button className="btn-custom btn-secondary-custom shadow-sm" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          <button className="btn-custom btn-primary-gradient shadow-sm" onClick={() => {
            setEditingTripId(null);
            setNewTrip({ route: '', driver: '', vehicle: '', status: 'Scheduled', date: '' });
            setIsAddModalOpen(true);
          }}>
            <FaPlus /> Add Trip
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
            <select 
              className="form-select text-secondary fw-semibold" 
              style={{ borderRadius: '12px', minWidth: '160px', padding: '0.55rem 1.2rem', borderColor: 'rgba(100, 116, 139, 0.22)' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
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
        <TripTable trips={filteredTrips} onEdit={handleEditClick} onDelete={handleDelete} />
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
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingTripId(null);
                setNewTrip({ route: '', driver: '', vehicle: '', status: 'Scheduled', date: '' });
              }}
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
                    <h5 className="modal-title fw-bold">{editingTripId ? 'Edit Trip' : 'Add New Trip'}</h5>
                    <button type="button" className="btn-close" onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingTripId(null);
                      setNewTrip({ route: '', driver: '', vehicle: '', status: 'Scheduled', date: '' });
                    }}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddSubmit}>
                      <div className="mb-3">
                        <label className="form-label text-secondary fw-semibold small">Route</label>
                        <input type="text" className="form-control" required value={newTrip.route} onChange={e => setNewTrip({...newTrip, route: e.target.value})} placeholder="e.g. NY to Boston" />
                      </div>
                      <div className="mb-3 position-relative" ref={dropdownRef}>
                        <label className="form-label text-secondary fw-semibold small">Driver</label>
                        <div 
                          className="form-control d-flex justify-content-between align-items-center cursor-pointer bg-white"
                          style={{ minHeight: '38px', borderRadius: '8px', cursor: 'pointer' }}
                          onClick={() => setIsDriverDropdownOpen(!isDriverDropdownOpen)}
                        >
                          <span className={newTrip.driver ? 'text-dark' : 'text-muted'}>
                            {newTrip.driver || 'Select Driver'}
                          </span>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
                        </div>

                        {/* Hidden input to support HTML5 validation */}
                        <input
                          type="text"
                          required
                          value={newTrip.driver}
                          onChange={() => {}}
                          tabIndex={-1}
                          style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                        />

                        {isDriverDropdownOpen && (
                          <div 
                            className="position-absolute w-100 bg-white border shadow-lg mt-1 p-2" 
                            style={{ zIndex: 1060, borderRadius: '8px', maxHeight: '250px', overflowY: 'auto' }}
                          >
                            <div className="input-group mb-2">
                              <span className="input-group-text bg-light border-end-0 py-1 px-2">
                                <FiSearch size={14} className="text-muted" />
                              </span>
                              <input
                                type="text"
                                className="form-control form-control-sm border-start-0"
                                placeholder="Search driver by name..."
                                value={driverSearch}
                                onChange={(e) => setDriverSearch(e.target.value)}
                                style={{ fontSize: '13px' }}
                                autoFocus
                              />
                            </div>
                            <div className="list-group list-group-flush" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                              {filteredDrivers.length > 0 ? (
                                filteredDrivers.map((d) => (
                                  <button
                                    key={d._id || d.id}
                                    type="button"
                                    className="list-group-item list-group-item-action border-0 px-2 py-1.5 rounded text-start"
                                    onClick={() => {
                                      setNewTrip({ ...newTrip, driver: d.fullName || d.name, driverId: d._id || d.id });
                                      setIsDriverDropdownOpen(false);
                                      setDriverSearch('');
                                    }}
                                    style={{ fontSize: '13px' }}
                                  >
                                    {d.fullName || d.name}
                                  </button>
                                ))
                              ) : (
                                <div className="text-center py-2 text-muted" style={{ fontSize: '12px' }}>
                                  No drivers found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3 position-relative" ref={vehicleDropdownRef}>
                          <label className="form-label text-secondary fw-semibold small">Vehicle</label>
                          <div 
                            className="form-control d-flex justify-content-between align-items-center cursor-pointer bg-white"
                            style={{ minHeight: '38px', borderRadius: '8px', cursor: 'pointer' }}
                            onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                          >
                            <span className={newTrip.vehicle ? 'text-dark' : 'text-muted'}>
                              {newTrip.vehicle || 'Select Vehicle'}
                            </span>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
                          </div>

                          {/* Hidden input to support HTML5 validation */}
                          <input
                            type="text"
                            required
                            value={newTrip.vehicle}
                            onChange={() => {}}
                            tabIndex={-1}
                            style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                          />

                          {isVehicleDropdownOpen && (
                            <div 
                              className="position-absolute w-100 bg-white border shadow-lg mt-1 p-2" 
                              style={{ zIndex: 1060, borderRadius: '8px', maxHeight: '250px', overflowY: 'auto' }}
                            >
                              <div className="input-group mb-2">
                                <span className="input-group-text bg-light border-end-0 py-1 px-2">
                                  <FiSearch size={14} className="text-muted" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control form-control-sm border-start-0"
                                  placeholder="Search vehicle..."
                                  value={vehicleSearch}
                                  onChange={(e) => setVehicleSearch(e.target.value)}
                                  style={{ fontSize: '13px' }}
                                  autoFocus
                                />
                              </div>
                              <div className="list-group list-group-flush" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                {filteredVehicles.length > 0 ? (
                                  filteredVehicles.map((v) => (
                                    <button
                                      key={v._id || v.id}
                                      type="button"
                                      className="list-group-item list-group-item-action border-0 px-2 py-1.5 rounded text-start"
                                      onClick={() => {
                                        setNewTrip({ ...newTrip, vehicle: v.registrationNumber || v.vehicleName, vehicleId: v._id || v.id });
                                        setIsVehicleDropdownOpen(false);
                                        setVehicleSearch('');
                                      }}
                                      style={{ fontSize: '13px' }}
                                    >
                                      <div className="fw-semibold">{v.registrationNumber}</div>
                                      <div className="text-muted" style={{ fontSize: '11px' }}>
                                        {v.vehicleName} {v.vehicleModel ? `(${v.vehicleModel})` : ''}
                                      </div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="text-center py-2 text-muted" style={{ fontSize: '12px' }}>
                                    No vehicles found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
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
                        <button type="button" className="btn-custom btn-secondary-custom shadow-sm" onClick={() => {
                          setIsAddModalOpen(false);
                          setEditingTripId(null);
                          setNewTrip({ route: '', driver: '', vehicle: '', status: 'Scheduled', date: '' });
                        }}>Cancel</button>
                        <button type="submit" className="btn-custom btn-primary-gradient shadow-sm" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : editingTripId ? 'Save Changes' : 'Add Trip'}
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
