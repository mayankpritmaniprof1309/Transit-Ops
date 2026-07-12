import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import * as reportValidation from '../validations/report.validation.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Allowed roles for accessing reports (Fleet Manager, Financial Analyst, and read-only roles Dispatcher and Safety Officer)
const REPORT_ROLES = ['Fleet Manager', 'Financial Analyst', 'Dispatcher', 'Safety Officer'];

/**
 * GET /dashboard
 * General analytics dashboard report.
 */
router.get(
  '/dashboard',
  protect,
  authorize(...REPORT_ROLES),
  reportValidation.dashboardReportValidation,
  reportController.getDashboardReport
);

/**
 * GET /fuel-efficiency
 * Fuel efficiency analysis per completed trip.
 */
router.get(
  '/fuel-efficiency',
  protect,
  authorize(...REPORT_ROLES),
  reportValidation.fuelReportValidation,
  reportController.getFuelEfficiencyReport
);

/**
 * GET /operational-cost
 * Sum of fuel, maintenance, and other expenses per vehicle.
 */
router.get(
  '/operational-cost',
  protect,
  authorize(...REPORT_ROLES),
  reportValidation.expenseReportValidation,
  reportController.getOperationalCostReport
);

/**
 * GET /vehicle-roi
 * Return on Investment analytics per vehicle.
 */
router.get(
  '/vehicle-roi',
  protect,
  authorize(...REPORT_ROLES),
  reportValidation.vehicleReportValidation,
  reportController.getVehicleROIReport
);

/**
 * GET /vehicle/:vehicleId
 * Detailed status and history report for a single vehicle.
 */
router.get(
  '/vehicle/:vehicleId',
  protect,
  authorize(...REPORT_ROLES),
  reportController.getVehicleWiseReport
);

/**
 * GET /trips
 * Paginated and filtered lists of trips.
 */
router.get(
  '/trips',
  protect,
  authorize(...REPORT_ROLES),
  reportValidation.tripReportValidation,
  reportController.getTripReport
);

/**
 * GET /export/csv
 * Exports target metrics as download-ready CSV strings.
 */
router.get(
  '/export/csv',
  protect,
  authorize(...REPORT_ROLES),
  reportValidation.exportCsvValidation,
  reportController.exportCsv
);

export default router;
