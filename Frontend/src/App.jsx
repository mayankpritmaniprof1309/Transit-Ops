import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiTruck, FiUsers, FiMap, FiSettings, FiLogOut, FiTool, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import TripPage from './pages/trip/TripPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import './App.css';
import { motion } from 'framer-motion';

// Mock components for routing
const Dashboard = () => <div className="p-4"><h2>Dashboard</h2></div>;
const Vehicles = () => <div className="p-4"><h2>Vehicles</h2></div>;
const Drivers = () => <div className="p-4"><h2>Drivers</h2></div>;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome /> },
    { path: '/vehicles', name: 'Vehicles', icon: <FiTruck /> },
    { path: '/drivers', name: 'Drivers', icon: <FiUsers /> },
    { path: '/trips', name: 'Trips', icon: <FiMap /> },
    { path: '/maintenance', name: 'Maintenance', icon: <FiTool /> },
    { path: '/settings', name: 'Settings', icon: <FiSettings /> },
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
        <Link to="/logout" className="sidebar-link text-danger mt-4">
          <span className="sidebar-icon"><FiLogOut /></span>
          Logout
        </Link>
      </div>
    </div>
  );
};

const Navbar = () => {
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
            <p className="m-0 fw-semibold text-dark fs-6 lh-1">Admin User</p>
            <small className="text-secondary">Fleet Manager</small>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="d-flex" style={{ minHeight: '100vh', background: 'transparent' }}>
        <Sidebar />
        
        <div className="flex-grow-1 d-flex flex-column" style={{ width: 'calc(100% - 260px)' }}>
          <Navbar />
          
          <main className="flex-grow-1 p-2" style={{ overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/drivers" element={<Drivers />} />
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
