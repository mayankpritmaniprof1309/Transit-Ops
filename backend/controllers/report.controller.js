import * as reportService from '../services/report.service.js';

/**
 * Helper to determine appropriate HTTP status code based on error message.
 */
const getErrorStatusCode = (error) => {
  const msg = error.message.toLowerCase();
  if (msg.includes('not found') || msg.includes('exist')) {
    return 404;
  }
  return 400; // Default to Bad Request
};

/**
 * GET /dashboard
 * Retrieve general dashboard metrics.
 */
export const getDashboardReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.getDashboardReport(startDate, endDate);
    return res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully.',
      data: report,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /fuel-efficiency
 * Retrieve fuel efficiency analysis.
 */
export const getFuelEfficiencyReport = async (req, res) => {
  try {
    const { startDate, endDate, vehicleId } = req.query;
    const report = await reportService.getFuelEfficiencyReport(startDate, endDate, vehicleId);
    return res.status(200).json({
      success: true,
      message: 'Fuel efficiency report generated successfully.',
      data: report,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /operational-cost
 * Retrieve operational cost report.
 */
export const getOperationalCostReport = async (req, res) => {
  try {
    const { startDate, endDate, vehicleId } = req.query;
    const report = await reportService.getOperationalCostReport(startDate, endDate, vehicleId);
    return res.status(200).json({
      success: true,
      message: 'Operational cost report generated successfully.',
      data: report,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /vehicle-roi
 * Retrieve Return on Investment analysis.
 */
export const getVehicleROIReport = async (req, res) => {
  try {
    const { startDate, endDate, vehicleId } = req.query;
    const report = await reportService.getVehicleROIReport(startDate, endDate, vehicleId);
    return res.status(200).json({
      success: true,
      message: 'Vehicle ROI report generated successfully.',
      data: report,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /vehicle/:vehicleId
 * Retrieve detailed status and history of a specific vehicle.
 */
export const getVehicleWiseReport = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const report = await reportService.getVehicleWiseReport(vehicleId);
    return res.status(200).json({
      success: true,
      message: 'Vehicle-wise history report retrieved successfully.',
      data: report,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /trips
 * Retrieve list of trips with filter/search and pagination.
 */
export const getTripReport = async (req, res) => {
  try {
    const report = await reportService.getTripReport(req.query);
    return res.status(200).json({
      success: true,
      message: 'Trip analytics report retrieved successfully.',
      data: report,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /export/csv
 * Export data to CSV format.
 */
export const exportCsv = async (req, res) => {
  try {
    const { type, ...filters } = req.query;
    const { filename, csvData } = await reportService.exportCsv(type, filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.status(200).send(csvData);
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};
