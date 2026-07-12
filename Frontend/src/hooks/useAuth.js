import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * useAuth — convenience hook for consuming AuthContext.
 * Throws a descriptive error if used outside <AuthProvider>.
 *
 * @returns {{ user, isAuthenticated, isLoading, login, register, logout, updateUser }}
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error(
      'useAuth() must be used within an <AuthProvider>. ' +
      'Wrap your component tree with <AuthProvider> (see App.jsx).'
    );
  }
  return context;
}
