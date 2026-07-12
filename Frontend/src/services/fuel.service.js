import api from './api.js';

/**
 * Normalizes a backend fuel log record to match frontend property names.
 */
const normalizeLog = (log) => {
  if (!log) return null;
  return {
    ...log,
    quantity: log.fuelQuantity,
    cost: log.fuelCost,
    date: log.fuelDate,
    odometer: log.odometerReading,
    pricePerUnit: log.pricePerUnit || (log.fuelQuantity > 0 ? (log.fuelCost / log.fuelQuantity) : 0),
  };
};

/**
 * Converts a frontend log payload back to the backend's expected schema keys.
 */
const denormalizePayload = (data) => {
  return {
    vehicle: data.vehicle,
    trip: data.trip || undefined,
    fuelQuantity: Number(data.quantity),
    fuelCost: Number(data.cost),
    fuelStation: data.fuelStation || '',
    fuelDate: data.date,
    odometerReading: Number(data.odometer),
    remarks: data.remarks || '',
  };
};

/**
 * Fetch all fuel logs with optional filters (search, vehicle, page, limit).
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} API response data.
 */
export const getAllFuelLogs = async (params = {}) => {
  const response = await api.get('/fuel-logs', { params });
  if (response.data && response.data.success) {
    if (Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(normalizeLog);
    } else if (response.data.data && Array.isArray(response.data.data.fuelLogs)) {
      response.data.data.fuelLogs = response.data.data.fuelLogs.map(normalizeLog);
    }
  }
  return response.data;
};

/**
 * Fetch detailed specification for a specific fuel log by ID.
 * @param {string} id - Fuel Log ID.
 * @returns {Promise<Object>} API response data.
 */
export const getFuelLog = async (id) => {
  const response = await api.get(`/fuel-logs/${id}`);
  if (response.data && response.data.success && response.data.data) {
    response.data.data = normalizeLog(response.data.data);
  }
  return response.data;
};

/**
 * Register a new fuel purchase log.
 * @param {Object} data - Fuel log body data.
 * @returns {Promise<Object>} API response data.
 */
export const createFuelLog = async (data) => {
  const payload = denormalizePayload(data);
  const response = await api.post('/fuel-logs', payload);
  return response.data;
};

/**
 * Update an existing fuel purchase log.
 * @param {string} id - Fuel Log ID.
 * @param {Object} data - Fuel log update fields.
 * @returns {Promise<Object>} API response data.
 */
export const updateFuelLog = async (id, data) => {
  const payload = denormalizePayload(data);
  const response = await api.put(`/fuel-logs/${id}`, payload);
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
