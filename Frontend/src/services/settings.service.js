import api from './api.js';

/**
 * Fetch the currently logged-in user profile from the backend.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Object>} API response data.
 */
export const getProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

/**
 * Update the user profile (Name, Phone, Email, etc.).
 * @param {string} userId - ID of the user to update.
 * @param {Object} profileData - Updated portfolio fields.
 * @returns {Promise<Object>} API response data.
 */
export const updateProfile = async (userId, profileData) => {
  const response = await api.put(`/users/${userId}`, profileData);
  if (response.data.success) {
    // Update local storage representation of the user
    const updatedUser = response.data.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

/**
 * Change the user account password.
 * @param {string} userId - ID of the user.
 * @param {Object} passwordData - { password } object.
 * @returns {Promise<Object>} API response data.
 */
export const changePassword = async (userId, passwordData) => {
  // The backend's updateUser PUT /api/users/:id validates and hashes password if present
  const response = await api.put(`/users/${userId}`, passwordData);
  return response.data;
};

/**
 * Update user notification preferences (local-only storage).
 * @param {Object} preferences - The notification switches mapping.
 * @returns {Object} Saved preferences.
 */
export const updateNotificationPreferences = (preferences) => {
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  return preferences;
};

/**
 * Fetch notification preferences.
 * @returns {Object} Currently configured notification preferences.
 */
export const getNotificationPreferences = () => {
  const defaultPrefs = {
    emailNotifications: true,
    tripNotifications: true,
    maintenanceAlerts: true,
    fuelAlerts: true,
    expenseAlerts: true,
    reportReadyAlerts: false,
    pushNotifications: true,
  };
  const stored = localStorage.getItem('notificationPreferences');
  return stored ? JSON.parse(stored) : defaultPrefs;
};

/**
 * Update UI appearance settings (local-only storage).
 * @param {Object} appearance - { theme, accentColor, fontSize, sidebarCollapsed }
 * @returns {Object} Saved appearance configuration.
 */
export const updateAppearance = (appearance) => {
  localStorage.setItem('appearance', JSON.stringify(appearance));
  // Apply theme & accent class modifiers to the HTML/body tag if needed
  if (appearance.accentColor) {
    document.documentElement.setAttribute('data-accent', appearance.accentColor.toLowerCase());
  }
  if (appearance.fontSize) {
    document.documentElement.setAttribute('data-font-size', appearance.fontSize.toLowerCase());
  }
  return appearance;
};

/**
 * Fetch UI appearance configurations.
 * @returns {Object} Saved appearance settings.
 */
export const getAppearance = () => {
  const defaultAppearance = {
    theme: 'Light Theme',
    accentColor: 'Blue',
    fontSize: 'Medium',
    sidebar: 'Expanded',
  };
  const stored = localStorage.getItem('appearance');
  return stored ? JSON.parse(stored) : defaultAppearance;
};

/**
 * Deactivate user account (mock).
 * @param {string} userId - User ID to deactivate.
 * @returns {Promise<Object>} API response.
 */
export const deactivateAccount = async (userId) => {
  // We can pass isActive: false using PUT /api/users/:id
  const response = await api.put(`/users/${userId}`, { isActive: false });
  return response.data;
};

/**
 * Delete user account.
 * @param {string} userId - User ID to delete.
 * @returns {Promise<Object>} API response.
 */
export const deleteAccount = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

/**
 * Clean up credentials and log out the user session.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
