import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import TripPage from './pages/trip/TripPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import VehiclesPage from './pages/vehicle/VehiclesPage';
import DriversPage from './pages/driver/DriversPage';
import Login from './pages/auth/Login';

// Simple placeholders for routes not yet implemented as separate modules
const FuelLogs = () => (
  <div className="p-4 bg-white rounded-4 shadow-sm">
    <h2>Fuel Logs Page</h2>
    <p className="text-secondary">Fuel log operations and efficiency log placeholder.</p>
  </div>
);

const Expenses = () => (
  <div className="p-4 bg-white rounded-4 shadow-sm">
    <h2>Expenses Page</h2>
    <p className="text-secondary">Track operational costs and expenses placeholder.</p>
  </div>
);

const Reports = () => (
  <div className="p-4 bg-white rounded-4 shadow-sm">
    <h2>Reports Page</h2>
    <p className="text-secondary">Fleet ROI and efficiency stats reports placeholder.</p>
  </div>
);

const Settings = () => (
  <div className="p-4 bg-white rounded-4 shadow-sm">
    <h2>Settings Page</h2>
    <p className="text-secondary">Profile settings and credentials configuration placeholder.</p>
  </div>
);

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
                <VehiclesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DriversPage />
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

        {/* Real Login Route */}
        <Route
          path="/login"
          element={<Login onAuthSuccess={() => window.location.href = '/dashboard'} />}
        />

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
