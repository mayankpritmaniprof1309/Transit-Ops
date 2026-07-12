import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiSearch, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

export default function Navbar({ onMenuToggle, user = {} }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const sampleNotifications = [
    { id: 1, text: 'Trip TR-102 has completed successfully.', time: '5m ago' },
    { id: 2, text: 'Vehicle MH-12-PQ-4567 is overdue for service.', time: '2h ago' },
    { id: 3, text: 'Driver John Doe updated license status.', time: '1d ago' }
  ];

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-effect border-bottom py-2.5 px-4" style={{ height: '70px', zIndex: 1020 }}>
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        {/* Left section: mobile hamburger & page identity */}
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="btn btn-light rounded-circle p-2 d-lg-none"
            aria-label="Toggle Menu"
          >
            <FiMenu size={20} />
          </button>
          
          <div className="position-relative d-none d-md-flex align-items-center">
            <span className="position-absolute start-0 ps-3 text-secondary">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search operations, trips, vehicles..."
              className="form-control rounded-pill border-0 bg-light py-2 ps-5 pe-4"
              style={{ width: '280px', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Right section: notifications, profile */}
        <div className="d-flex align-items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="position-relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="btn btn-light rounded-circle p-2 position-relative"
              aria-label="View Notifications"
            >
              <FiBell size={18} />
              <span className="position-absolute top-0 start-100 translate-middle p-1.5 bg-danger border border-white rounded-circle">
                <span className="visually-hidden">New notifications</span>
              </span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Backdrop click helper */}
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: -1 }} onClick={() => setShowNotifications(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="position-absolute end-0 mt-2 p-2 rounded-4 shadow-lg border bg-white glass-effect"
                    style={{ width: '320px', zIndex: 1040 }}
                  >
                    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                      <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>Notifications</span>
                      <span className="text-primary cursor-pointer" style={{ fontSize: '0.75rem' }}>Mark all read</span>
                    </div>
                    <div className="py-1">
                      {sampleNotifications.map((notif) => (
                        <div key={notif.id} className="px-3 py-2 border-bottom border-opacity-10 hover-bg rounded-3 cursor-pointer">
                          <p className="m-0 text-dark" style={{ fontSize: '0.8rem', lineHeight: '1.25' }}>{notif.text}</p>
                          <span className="text-secondary" style={{ fontSize: '0.7rem' }}>{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="position-relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="btn btn-light rounded-pill px-3 py-1.5 d-flex align-items-center gap-2 border"
            >
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="d-none d-sm-inline" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {user?.fullName || 'User'}
              </span>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: -1 }} onClick={() => setShowProfileMenu(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="position-absolute end-0 mt-2 p-2 rounded-4 shadow-lg border bg-white glass-effect"
                    style={{ width: '200px', zIndex: 1040 }}
                  >
                    <div className="px-3 py-2 border-bottom text-truncate">
                      <span className="d-block fw-semibold" style={{ fontSize: '0.85rem' }}>{user?.fullName || 'TransitOps User'}</span>
                      <span className="d-block text-secondary" style={{ fontSize: '0.75rem' }}>{user?.role || 'Operator'}</span>
                    </div>

                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="d-flex align-items-center gap-2 px-3 py-2 mt-1 rounded-3 text-decoration-none text-dark hover-bg"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <FiSettings size={15} />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="btn btn-link w-100 border-0 d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none text-danger hover-bg text-start"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <FiLogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
