import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth.service.js';

export const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app tree and provides authentication state + actions.
 * Must be rendered inside <Router> so useNavigate is available.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, hydrate user state from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (err) {
      console.error('AuthProvider: failed to hydrate user state', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log in a user with email and password.
   * On success, updates local state and returns the user object.
   */
  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    if (data.success) {
      const loggedInUser = data.data.user;
      setUser(loggedInUser);
      return loggedInUser;
    }
    throw new Error(data.message || 'Login failed');
  }, []);

  /**
   * Register a new user.
   * auth.service.register already calls login internally on success,
   * so localStorage is populated — we just sync the React state.
   */
  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    if (data.success) {
      const registeredUser = data.data.user;
      setUser(registeredUser);
      return registeredUser;
    }
    throw new Error(data.message || 'Registration failed');
  }, []);

  /**
   * Log the user out: clear storage, reset state, redirect to /login.
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  /**
   * Merge updated fields into the current user state.
   * Also persists the update to localStorage so ProtectedRoute / api.js stay in sync.
   */
  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({ user, isAuthenticated, isLoading, login, register, logout, updateUser }),
    [user, isAuthenticated, isLoading, login, register, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
