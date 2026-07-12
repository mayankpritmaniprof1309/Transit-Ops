import api from './api.js';

/**
 * Get all vehicles with optional filters, search, sorting, and pagination.
 * @param {Object} [params] - Query parameters.
 * @returns {Promise<Object>} API response data.
 */
export const getAllVehicles = async (params) => {
  const response = await api.get('/vehicles', { params });
  return response.data;
};

/**
 * Get a single vehicle details by ID.
 * @param {string} id - Vehicle ID.
 * @returns {Promise<Object>} API response data.
 */
export const getVehicle = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

/**
 * Create a new vehicle.
 * @param {Object} data - Vehicle specs payload.
 * @returns {Promise<Object>} API response data.
 */
export const createVehicle = async (data) => {
  const response = await api.post('/vehicles', data);
  return response.data;
};

/**
 * Update an existing vehicle by ID.
 * @param {string} id - Vehicle ID.
 * @param {Object} data - Updated specs payload.
 * @returns {Promise<Object>} API response data.
 */
export const updateVehicle = async (id, data) => {
  const response = await api.put(`/vehicles/${id}`, data);
  return response.data;
};

/**
 * Delete a vehicle by ID.
 * @param {string} id - Vehicle ID.
 * @returns {Promise<Object>} API response data.
 */
export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};
