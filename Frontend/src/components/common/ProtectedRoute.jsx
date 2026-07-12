import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token) {
    // No token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    let userRole = '';
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        userRole = parsed.role || '';
      } catch (err) {
        userRole = '';
      }
    }

    if (!allowedRoles.includes(userRole)) {
      // Role is not authorized to access this route, redirect back to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and authorized
  return children;
}
