import { query, param, validationResult } from 'express-validator';

// Helper to check validation results and return custom error format
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({
      success: false,
      message: `Validation failed: ${errorMessages}`,
    });
  }
  next();
};

export const dashboardReportValidation = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO8601 date'),
  handleValidationErrors,
];

export const vehicleReportValidation = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO8601 date'),
  handleValidationErrors,
];

export const tripReportValidation = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO8601 date'),
  query('vehicleId')
    .optional()
    .isMongoId().withMessage('Vehicle ID must be a valid Mongo ID'),
  query('driverId')
    .optional()
    .isMongoId().withMessage('Driver ID must be a valid Mongo ID'),
  query('tripStatus')
    .optional()
    .isIn(['Draft', 'Dispatched', 'Completed', 'Cancelled']).withMessage('Invalid trip status'),
  query('search')
    .optional()
    .isString().withMessage('Search query must be a string'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page number must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('Limit must be an integer >= 1'),
  query('sortBy')
    .optional()
    .isString().withMessage('Sort by field must be a string'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Sort order must be either asc or desc'),
  handleValidationErrors,
];

export const fuelReportValidation = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO8601 date'),
  query('vehicleId')
    .optional()
    .isMongoId().withMessage('Vehicle ID must be a valid Mongo ID'),
  handleValidationErrors,
];

export const expenseReportValidation = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO8601 date'),
  query('vehicleId')
    .optional()
    .isMongoId().withMessage('Vehicle ID must be a valid Mongo ID'),
  handleValidationErrors,
];

export const exportCsvValidation = [
  query('type')
    .notEmpty().withMessage('Export type is required')
    .isIn(['trips', 'vehicles', 'drivers', 'expenses', 'fuel_logs']).withMessage('Invalid export type'),
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO8601 date'),
  query('vehicleId')
    .optional()
    .isMongoId().withMessage('Vehicle ID must be a valid Mongo ID'),
  query('driverId')
    .optional()
    .isMongoId().withMessage('Driver ID must be a valid Mongo ID'),
  query('tripStatus')
    .optional()
    .isIn(['Draft', 'Dispatched', 'Completed', 'Cancelled']).withMessage('Invalid trip status'),
  handleValidationErrors,
];
