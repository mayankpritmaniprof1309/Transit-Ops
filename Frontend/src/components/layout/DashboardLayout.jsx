import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarActive, setMobileSidebarActive] = useState(false);
  const [user, setUser] = useState({});
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        setUser({});
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarActive(!mobileSidebarActive);
  };

  return (
    <div className="blob-bg-container d-flex">
      {/* Background Gradient Blobs */}
      <div className="gradient-blob blob-blue" />
      <div className="gradient-blob blob-purple" />

      {/* Backdrop overlay for mobile sidebar */}
      {mobileSidebarActive && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1025 }}
          onClick={() => setMobileSidebarActive(false)}
        />
      )}

      {/* Sidebar Panel */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileActive={mobileSidebarActive}
        closeMobileSidebar={() => setMobileSidebarActive(false)}
      />

      {/* Main Panel Viewport */}
      <div
        className={`main-content-layout d-flex flex-column w-100 min-vh-100 ${
          isSidebarCollapsed ? 'main-content-collapsed' : ''
        }`}
      >
        {/* Sticky Glass Navbar */}
        <Navbar onMenuToggle={toggleMobileSidebar} user={user} />

        {/* Dynamic Route Content */}
        <main className="flex-grow-1 p-4 main-content-wrapper d-flex flex-column">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="d-flex flex-column flex-grow-1"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
