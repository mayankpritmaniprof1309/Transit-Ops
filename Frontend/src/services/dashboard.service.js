import api from './api.js';

/**
 * Fetch core dashboard KPI stats (total vehicles, drivers on duty, active trips, fleet utilization).
 */
export const getDashboardKPIs = async () => {
  const response = await api.get('/dashboard');
  return response.data.data;
};

/**
 * Fetch total expense breakdowns (fuel cost, maintenance cost, insurance, tolls, repairs).
 */
export const getExpenseStats = async () => {
  const response = await api.get('/expenses/statistics');
  return response.data.data;
};

/**
 * Fetch trip records supporting pagination, limits, sorting, or queries.
 */
export const getRecentTrips = async (limit = 5) => {
  const response = await api.get(`/reports/trips?limit=${limit}&sortBy=createdAt&sortOrder=desc`);
  return response.data.data;
};

/**
 * Fetch all fuel logs to chart historical cost trends.
 */
export const getFuelLogs = async () => {
  const response = await api.get('/fuel-logs');
  return response.data.data;
};
