import api from './api.js';

/**
 * Fetch the general analytics dashboard report.
 * @param {Object} params - Optional query filters (startDate, endDate, vehicleId).
 * @returns {Promise<Object>} API response.
 */
export const getDashboardReport = async (params = {}) => {
  const response = await api.get('/reports/dashboard', { params });
  return response.data;
};

/**
 * Fetch fuel efficiency analysis per completed trip.
 * @param {Object} params - Optional query filters (startDate, endDate, vehicleId).
 * @returns {Promise<Object>} API response.
 */
export const getFuelEfficiencyReport = async (params = {}) => {
  const response = await api.get('/reports/fuel-efficiency', { params });
  return response.data;
};

/**
 * Fetch operational cost breakdown (fuel + maintenance + expenses) per vehicle.
 * @param {Object} params - Optional query filters (startDate, endDate, vehicleId).
 * @returns {Promise<Object>} API response.
 */
export const getOperationalCostReport = async (params = {}) => {
  const response = await api.get('/reports/operational-cost', { params });
  return response.data;
};

/**
 * Fetch vehicle Return on Investment (ROI) analytics.
 * @param {Object} params - Optional query filters (startDate, endDate).
 * @returns {Promise<Object>} API response.
 */
export const getVehicleROIReport = async (params = {}) => {
  const response = await api.get('/reports/vehicle-roi', { params });
  return response.data;
};

/**
 * Fetch trips report with pagination and filters.
 * @param {Object} params - Optional query filters (startDate, endDate, vehicleId, status, page, limit).
 * @returns {Promise<Object>} API response.
 */
export const getTripReport = async (params = {}) => {
  const response = await api.get('/reports/trips', { params });
  return response.data;
};

/**
 * Fetch vehicle-wise detailed report.
 * @param {string} vehicleId - Target vehicle ID.
 * @param {Object} params - Optional query filters.
 * @returns {Promise<Object>} API response.
 */
export const getVehicleWiseReport = async (vehicleId, params = {}) => {
  const response = await api.get(`/reports/vehicle/${vehicleId}`, { params });
  return response.data;
};

/**
 * Export report data as a downloadable CSV blob.
 * @param {Object} params - Query params including `type` (fuel|expenses|trips|maintenance).
 * @returns {Promise<Blob>} Binary CSV blob.
 */
export const exportCSV = async (params = {}) => {
  const response = await api.get('/reports/export/csv', {
    params,
    responseType: 'blob',
  });
  return response.data;
};
