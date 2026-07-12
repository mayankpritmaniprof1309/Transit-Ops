import React, { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiSearch, FiFilter } from 'react-icons/fi';
import TripTable from '../../components/trip/TripTable';
import TripService from '../../services/trip.service';
import { motion } from 'framer-motion';

const TripPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTrips = trips.filter(trip => 
    trip.route.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trip.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
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
          <button className="btn-secondary-soft">
            <FiDownload /> Export
          </button>
          <button className="btn-primary-gradient">
            <FiPlus /> Add Trip
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
              placeholder="Search by route, driver, vehicle..." 
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
        <TripTable trips={filteredTrips} onDelete={handleDelete} />
      )}
    </motion.div>
  );
};

export default TripPage;
