import api from './api.js';

/**
 * Get all drivers with optional filter parameters.
 * @param {Object} [params] - Query parameters.
 * @returns {Promise<Object>} API response data.
 */
export const getAllDrivers = async (params) => {
  const response = await api.get('/drivers', { params });
  return response.data;
};

/**
 * Get a single driver by ID.
 * @param {string} id - Driver ID.
 * @returns {Promise<Object>} API response data.
 */
export const getDriver = async (id) => {
  const response = await api.get(`/drivers/${id}`);
  return response.data;
};

/**
 * Enroll a new driver.
 * @param {Object} data - Driver details payload.
 * @returns {Promise<Object>} API response data.
 */
export const createDriver = async (data) => {
  const response = await api.post('/drivers', data);
  return response.data;
};

/**
 * Update an existing driver portfolio by ID.
 * @param {string} id - Driver ID.
 * @param {Object} data - Updated details payload.
 * @returns {Promise<Object>} API response data.
 */
export const updateDriver = async (id, data) => {
  const response = await api.put(`/drivers/${id}`, data);
  return response.data;
};

/**
 * Delete or suspend a driver portfolio by ID.
 * @param {string} id - Driver ID.
 * @returns {Promise<Object>} API response data.
 */
export const deleteDriver = async (id) => {
  const response = await api.delete(`/drivers/${id}`);
  return response.data;
};
