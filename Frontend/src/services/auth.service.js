import api from './api.js';

/**
 * Log in a user and save token / user state.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User data and token.
 */
export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  if (response.data.success) {
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
};

/**
 * Register a new user and save token / user state.
 * @param {Object} userData - Registration fields (fullName, email, password, role).
 * @returns {Promise<Object>} Created user and login credentials.
 */
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  if (response.data.success) {
    // Automatically log in user after successful registration
    const loginRes = await login(userData.email, userData.password);
    return loginRes;
  }
  return response.data;
};

/**
 * Log out user and clean local storage state.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if the user is currently authenticated.
 * @returns {boolean} True if token exists.
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get the currently logged in user details.
 * @returns {Object|null} User details object.
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
