import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import TripPage from './pages/trip/TripPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';

// Simple placeholders for routes not yet implemented as separate modules
const Vehicles = () => <div className="p-4 bg-white rounded-4 shadow-sm"><h2>Vehicles Page</h2><p className="text-secondary">Vehicle list and details page placeholder.</p></div>;
const Drivers = () => <div className="p-4 bg-white rounded-4 shadow-sm"><h2>Drivers Page</h2><p className="text-secondary">Driver profiles and safety scores placeholder.</p></div>;
const FuelLogs = () => <div className="p-4 bg-white rounded-4 shadow-sm"><h2>Fuel Logs Page</h2><p className="text-secondary">Fuel log operations and efficiency log placeholder.</p></div>;
const Expenses = () => <div className="p-4 bg-white rounded-4 shadow-sm"><h2>Expenses Page</h2><p className="text-secondary">Track operational costs and expenses placeholder.</p></div>;
const Reports = () => <div className="p-4 bg-white rounded-4 shadow-sm"><h2>Reports Page</h2><p className="text-secondary">Fleet ROI and efficiency stats reports placeholder.</p></div>;
const Settings = () => <div className="p-4 bg-white rounded-4 shadow-sm"><h2>Settings Page</h2><p className="text-secondary">Profile settings and credentials configuration placeholder.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected layout routing */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Vehicles />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Drivers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TripPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MaintenancePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fuel-logs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <FuelLogs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Expenses />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
              <div className="card p-4 shadow text-center border-0" style={{ maxWidth: '380px', borderRadius: '18px' }}>
                <h2 className="fw-bold mb-3 text-dark">TransitOps</h2>
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
