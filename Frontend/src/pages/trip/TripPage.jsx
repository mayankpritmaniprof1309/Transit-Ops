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
  const [newTrip, setNewTrip] = useState({
    source: '', destination: '',
    driver: '', driverId: '',
    vehicle: '', vehicleId: '',
    tripStatus: 'Draft',
    dispatchDate: '',
    cargoWeight: '',
    plannedDistance: '',
  });
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
      // response = { success, data: [...trips] }
      setTrips(response.data || []);
    } catch (error) {
      console.error("Error loading trips", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await TripService.deleteTrip(id);
        setTrips(trips.filter(t => t._id !== id));
      } catch (error) {
        console.error("Error deleting trip", error);
        alert(error?.response?.data?.message || "Failed to delete trip.");
      }
    }
  };

  // 1. Export Functionality
  const handleExport = () => {
    if (trips.length === 0) return alert("No data to export");
    const headers = ['Trip Number', 'Source', 'Destination', 'Driver', 'Vehicle', 'Date', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredTrips.map(t => [
        t.tripNumber,
        `"${t.source}"`,
        `"${t.destination}"`,
        `"${t.driver?.fullName || t.driver || 'N/A'}"`,
        `"${t.vehicle?.registrationNumber || t.vehicle || 'N/A'}"`,
        t.dispatchDate ? new Date(t.dispatchDate).toLocaleDateString() : 'N/A',
        t.tripStatus
      ].join(','))
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

  // 2. Add/Edit Functionality
  const emptyTrip = {
    source: '', destination: '',
    driver: '', driverId: '',
    vehicle: '', vehicleId: '',
    tripStatus: 'Draft',
    dispatchDate: '',
    cargoWeight: '',
    plannedDistance: '',
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Build payload with ObjectIds for backend
      const payload = {
        source:          newTrip.source,
        destination:     newTrip.destination,
        driver:          newTrip.driverId,
        vehicle:         newTrip.vehicleId,
        tripStatus:      newTrip.tripStatus,
        dispatchDate:    newTrip.dispatchDate || undefined,
        cargoWeight:     parseFloat(newTrip.cargoWeight) || 0,
        plannedDistance: parseFloat(newTrip.plannedDistance) || 0,
      };

      if (editingTripId) {
        const response = await TripService.updateTrip(editingTripId, payload);
        setTrips(trips.map(t => t._id === editingTripId ? response.data : t));
      } else {
        const response = await TripService.createTrip(payload);
        setTrips([...trips, response.data]);
      }
      setIsAddModalOpen(false);
      setEditingTripId(null);
      setNewTrip(emptyTrip);
    } catch (error) {
      console.error("Error saving trip", error);
      alert(error?.response?.data?.message || "Failed to save trip.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (trip) => {
    setNewTrip({
      source:          trip.source || '',
      destination:     trip.destination || '',
      driver:          trip.driver?.fullName || '',
      driverId:        trip.driver?._id || trip.driver || '',
      vehicle:         trip.vehicle?.registrationNumber || '',
      vehicleId:       trip.vehicle?._id || trip.vehicle || '',
      tripStatus:      trip.tripStatus || 'Draft',
      dispatchDate:    trip.dispatchDate ? new Date(trip.dispatchDate).toISOString().split('T')[0] : '',
      cargoWeight:     trip.cargoWeight || '',
      plannedDistance: trip.plannedDistance || '',
    });
    setEditingTripId(trip._id);
    setIsAddModalOpen(true);
  };

  const filteredTrips = trips.filter(trip => {
    const route = `${trip.source || ''} ${trip.destination || ''}`.toLowerCase();
    const driverName = (trip.driver?.fullName || trip.driver || '').toLowerCase();
    const vehicleReg = (trip.vehicle?.registrationNumber || trip.vehicle || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || route.includes(term) || driverName.includes(term) || vehicleReg.includes(term);
    const matchesStatus = statusFilter === 'All' || trip.tripStatus === statusFilter;
    return matchesSearch && matchesStatus;
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
              <option value="Draft">Draft</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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
                setNewTrip(emptyTrip);
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
                      setNewTrip(emptyTrip);
                    }}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Source</label>
                          <input type="text" className="form-control" required
                            value={newTrip.source}
                            onChange={e => setNewTrip({...newTrip, source: e.target.value})}
                            placeholder="e.g. Mumbai, MH" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Destination</label>
                          <input type="text" className="form-control" required
                            value={newTrip.destination}
                            onChange={e => setNewTrip({...newTrip, destination: e.target.value})}
                            placeholder="e.g. Pune, MH" />
                        </div>
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
                          <label className="form-label text-secondary fw-semibold small">Dispatch Date</label>
                          <input type="date" className="form-control"
                            value={newTrip.dispatchDate}
                            onChange={e => setNewTrip({...newTrip, dispatchDate: e.target.value})} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Cargo Weight (kg)</label>
                          <input type="number" className="form-control" min="0"
                            value={newTrip.cargoWeight}
                            onChange={e => setNewTrip({...newTrip, cargoWeight: e.target.value})}
                            placeholder="e.g. 1200" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label text-secondary fw-semibold small">Planned Distance (km)</label>
                          <input type="number" className="form-control" min="0"
                            value={newTrip.plannedDistance}
                            onChange={e => setNewTrip({...newTrip, plannedDistance: e.target.value})}
                            placeholder="e.g. 350" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small">Status</label>
                        <select className="form-select"
                          value={newTrip.tripStatus}
                          onChange={e => setNewTrip({...newTrip, tripStatus: e.target.value})}>
                          <option value="Draft">Draft</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn-custom btn-secondary-custom shadow-sm" onClick={() => {
                          setIsAddModalOpen(false);
                          setEditingTripId(null);
                          setNewTrip(emptyTrip);
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
