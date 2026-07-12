import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiTruck, FiUsers, FiMap, FiSettings, FiLogOut, FiTool, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Page Imports
import VehiclesPage from './pages/vehicle/VehiclesPage';
import DriversPage from './pages/driver/DriversPage';
import TripPage from './pages/trip/TripPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import Login from './pages/auth/Login';

// Services
import { logout } from './services/auth.service';
import './App.css';

// Mock dashboard
const Dashboard = () => (
  <div className="p-4">
    <h2>Smart Transport Dashboard</h2>
    <p className="text-muted">Welcome to the TransitOps smart transport dashboard.</p>
  </div>
);

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome /> },
    { path: '/vehicles', name: 'Vehicles', icon: <FiTruck /> },
    { path: '/drivers', name: 'Drivers', icon: <FiUsers /> },
    { path: '/trips', name: 'Trips', icon: <FiMap /> },
    { path: '/maintenance', name: 'Maintenance', icon: <FiTool /> },
  ];

  return (
    <div className="sidebar p-4 d-flex flex-column" style={{ width: '260px' }}>
      <div className="mb-5 d-flex align-items-center gap-2">
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }} className="d-flex justify-content-center align-items-center shadow">
          <FiTruck color="white" size={20} />
        </div>
        <h4 className="m-0 fw-bold" style={{ letterSpacing: '0.5px' }}>TransitOps</h4>
      </div>
      
      <div className="flex-grow-1">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.name} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">{item.icon}</span>
              {item.name}
              {isActive && <motion.div layoutId="sidebar-active" className="sidebar-active-indicator" />}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="sidebar-link text-danger mt-4 border-0 bg-transparent text-start w-100 d-flex align-items-center gap-2"
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-icon"><FiLogOut /></span>
          Logout
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  return (
    <nav className="glass-navbar px-4 py-3 d-flex justify-content-between align-items-center sticky-top">
      <div className="search-icon-wrapper" style={{ width: '300px' }}>
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          className="search-bar w-100" 
          placeholder="Search everywhere..." 
          style={{ background: 'rgba(255, 255, 255, 0.5)' }}
        />
      </div>
      
      <div className="d-flex align-items-center gap-4">
        <button className="btn btn-link text-dark p-0 position-relative hover-lift">
          <FiBell size={22} />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>
        
        <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
          <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center text-white shadow-sm" style={{ width: '40px', height: '40px' }}>
            <FiUser />
          </div>
          <div className="d-none d-md-block">
            <p className="m-0 fw-semibold text-dark fs-6 lh-1">{currentUser?.fullName || 'Admin User'}</p>
            <small className="text-secondary">{currentUser?.role || 'Fleet Manager'}</small>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Router>
      <div className="d-flex" style={{ minHeight: '100vh', background: 'transparent' }}>
        <Sidebar onLogout={handleLogout} />
        
        <div className="flex-grow-1 d-flex flex-column" style={{ width: 'calc(100% - 260px)' }}>
          <Navbar />
          
          <main className="flex-grow-1 p-2" style={{ overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/trips" element={<TripPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
