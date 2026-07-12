import api from './api.js';

/**
 * Fetch aggregated reports data with optional filters (dateFrom, dateTo, vehicle, type).
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} API response data.
 */
export const getReports = async (params = {}) => {
  const response = await api.get('/reports', { params });
  return response.data;
};

/**
 * Fetch expense summary grouped by category.
 * @param {Object} params - Query parameters (dateFrom, dateTo, vehicle).
 * @returns {Promise<Object>} API response data.
 */
export const getExpenseReport = async (params = {}) => {
  const response = await api.get('/reports/expenses', { params });
  return response.data;
};

/**
 * Fetch fuel usage summary grouped by vehicle.
 * @param {Object} params - Query parameters (dateFrom, dateTo, vehicle).
 * @returns {Promise<Object>} API response data.
 */
export const getFuelReport = async (params = {}) => {
  const response = await api.get('/reports/fuel', { params });
  return response.data;
};

/**
 * Trigger CSV export for expense or fuel report.
 * @param {string} type - 'expenses' | 'fuel'
 * @param {Object} params - Query parameters.
 * @returns {Promise<Blob>} File blob for download.
 */
export const exportCSV = async (type = 'expenses', params = {}) => {
  const response = await api.get(`/reports/export/${type}`, {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Trigger PDF export for combined fleet report.
 * @param {Object} params - Query parameters.
 * @returns {Promise<Blob>} File blob for download.
 */
export const exportPDF = async (params = {}) => {
  const response = await api.get('/reports/export/pdf', {
    params,
    responseType: 'blob',
  });
  return response.data;
};
