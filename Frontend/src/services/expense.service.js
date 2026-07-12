import api from './api.js';

/**
 * Fetch all expense records with optional filters (search, vehicle, type, page, limit).
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} API response data.
 */
export const getAllExpenses = async (params = {}) => {
  const response = await api.get('/expenses', { params });
  return response.data;
};

/**
 * Fetch specifications for a specific expense record by ID.
 * @param {string} id - Expense ID.
 * @returns {Promise<Object>} API response data.
 */
export const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

/**
 * Record a new fleet expense item.
 * @param {Object} data - Expense record body data.
 * @returns {Promise<Object>} API response data.
 */
export const createExpense = async (data) => {
  const response = await api.post('/expenses', data);
  return response.data;
};

/**
 * Update an existing expense record.
 * @param {string} id - Expense ID.
 * @param {Object} data - Expense update fields.
 * @returns {Promise<Object>} API response data.
 */
export const updateExpense = async (id, data) => {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data;
};

/**
 * Delete a specific expense log item.
 * @param {string} id - Expense ID.
 * @returns {Promise<Object>} API response data.
 */
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};
