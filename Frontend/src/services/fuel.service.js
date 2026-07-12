import api from './api.js';

/**
 * Fetch all fuel logs with optional filters (search, vehicle, page, limit).
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} API response data.
 */
export const getAllFuelLogs = async (params = {}) => {
  const response = await api.get('/fuel-logs', { params });
  return response.data;
};

/**
 * Fetch detailed specification for a specific fuel log by ID.
 * @param {string} id - Fuel Log ID.
 * @returns {Promise<Object>} API response data.
 */
export const getFuelLog = async (id) => {
  const response = await api.get(`/fuel-logs/${id}`);
  return response.data;
};

/**
 * Register a new fuel purchase log.
 * @param {Object} data - Fuel log body data.
 * @returns {Promise<Object>} API response data.
 */
export const createFuelLog = async (data) => {
  const response = await api.post('/fuel-logs', data);
  return response.data;
};

/**
 * Update an existing fuel purchase log.
 * @param {string} id - Fuel Log ID.
 * @param {Object} data - Fuel log update fields.
 * @returns {Promise<Object>} API response data.
 */
export const updateFuelLog = async (id, data) => {
  const response = await api.put(`/fuel-logs/${id}`, data);
  return response.data;
};

/**
 * Delete a specific fuel log.
 * @param {string} id - Fuel Log ID.
 * @returns {Promise<Object>} API response data.
 */
export const deleteFuelLog = async (id) => {
  const response = await api.delete(`/fuel-logs/${id}`);
  return response.data;
};
