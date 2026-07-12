import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Placeholder Login / Public route for routing fallback */}
        <Route
          path="/login"
          element={
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
              <div className="card p-4 shadow text-center" style={{ maxWidth: '380px' }}>
                <h2 className="fw-bold mb-3">TransitOps Login</h2>
                <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>
                  Please login using the backend auth APIs or mock a token in localStorage.
                </p>
                <button
                  onClick={() => {
                    localStorage.setItem('token', 'sample-jwt-token');
                    localStorage.setItem('user', JSON.stringify({ fullName: 'TransitOps Manager', role: 'Fleet Manager' }));
                    window.location.href = '/dashboard';
                  }}
                  className="btn btn-premium-primary w-100"
                >
                  Mock Login (Fleet Manager)
                </button>
              </div>
            </div>
          }
        />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
