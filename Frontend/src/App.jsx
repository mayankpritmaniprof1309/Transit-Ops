import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import TripPage from './pages/trip/TripPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import VehiclesPage from './pages/vehicle/VehiclesPage';
import DriversPage from './pages/driver/DriversPage';
import FuelPage from './pages/fuel/FuelPage';
import Login from './pages/auth/Login';
import ExpensePage from './pages/expense/ExpensePage';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

import Settings from './pages/settings/Settings.jsx';

const Reports = () => (
  <div className="p-4 bg-white rounded-4 shadow-sm">
    <h2>Reports Page</h2>
    <p className="text-secondary">Fleet ROI and efficiency stats reports placeholder.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
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
                  <FuelPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ExpensePage />
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

          {/* Auth Routes */}
          <Route
            path="/login"
            element={<Login onAuthSuccess={() => window.location.href = '/dashboard'} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
