import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiMapPin,
  FiTool,
  FiDroplet,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { name: 'Vehicles', path: '/vehicles', icon: FiTruck },
  { name: 'Drivers', path: '/drivers', icon: FiUsers },
  { name: 'Trips', path: '/trips', icon: FiMapPin },
  { name: 'Maintenance', path: '/maintenance', icon: FiTool },
  { name: 'Fuel Logs', path: '/fuel-logs', icon: FiDroplet },
  { name: 'Expenses', path: '/expenses', icon: FiDollarSign },
  { name: 'Reports', path: '/reports', icon: FiBarChart2 },
  { name: 'Settings', path: '/settings', icon: FiSettings }
];

export default function Sidebar({ isCollapsed, toggleSidebar, mobileActive, closeMobileSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    if (closeMobileSidebar) closeMobileSidebar();
  };

  return (
    <aside
      className={`sidebar-container ${isCollapsed ? 'sidebar-collapsed' : ''} ${
        mobileActive ? 'sidebar-mobile-active' : ''
      } d-flex flex-column text-white`}
    >
      {/* Brand logo container */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-25" style={{ height: '70px' }}>
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <div
            className="d-flex align-items-center justify-content-center bg-primary rounded-3 text-white"
            style={{ minWidth: '40px', height: '40px', fontWeight: 'bold', fontSize: '1.25rem' }}
          >
            TO
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="fw-bold text-nowrap"
              style={{ fontSize: '1.15rem', color: '#F8FAFC' }}
            >
              TransitOps
            </motion.span>
          )}
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="btn btn-link text-secondary p-0 d-none d-lg-block hover-opacity"
        >
          {isCollapsed ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
        </button>
      </div>

      {/* Navigation menu list */}
      <div className="flex-grow-1 py-3 overflow-y-auto px-2">
        <ul className="nav nav-pills flex-column gap-1 list-unstyled">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className="nav-item">
                <NavLink
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-secondary transition-all ${
                      isActive ? 'bg-primary text-white active fw-semibold shadow-sm' : 'hover-bg-opacity text-white-50'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8'
                  })}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer/Logout container */}
      <div className="p-2 border-top border-secondary border-opacity-25">
        <button
          onClick={handleLogout}
          className="btn btn-link text-danger w-100 d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none hover-opacity"
        >
          <FiLogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-nowrap fw-semibold"
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </aside>
  );
}
