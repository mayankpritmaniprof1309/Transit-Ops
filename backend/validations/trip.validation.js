import { body, param, validationResult } from 'express-validator';

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

export const createTripValidation = [
  body('tripNumber')
    .trim()
    .notEmpty().withMessage('Trip number is required')
    .isString().withMessage('Trip number must be a string'),
  body('source')
    .trim()
    .notEmpty().withMessage('Source location is required')
    .isString().withMessage('Source location must be a string'),
  body('destination')
    .trim()
    .notEmpty().withMessage('Destination location is required')
    .isString().withMessage('Destination location must be a string'),
  body('vehicle')
    .notEmpty().withMessage('Vehicle ID is required')
    .isMongoId().withMessage('Vehicle ID must be a valid Mongo ID'),
  body('driver')
    .notEmpty().withMessage('Driver ID is required')
    .isMongoId().withMessage('Driver ID must be a valid Mongo ID'),
  body('cargoWeight')
    .notEmpty().withMessage('Cargo weight is required')
    .isFloat({ min: 0 }).withMessage('Cargo weight must be a positive number'),
  body('plannedDistance')
    .notEmpty().withMessage('Planned distance is required')
    .isFloat({ min: 0 }).withMessage('Planned distance must be a positive number'),
  body('expectedRevenue')
    .optional()
    .isFloat({ min: 0 }).withMessage('Expected revenue must be a positive number'),
  body('remarks')
    .optional()
    .trim()
    .isString().withMessage('Remarks must be a string'),
  handleValidationErrors,
];

export const updateTripValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Trip ID'),
  body('tripNumber')
    .optional()
    .trim()
    .notEmpty().withMessage('Trip number cannot be empty')
    .isString().withMessage('Trip number must be a string'),
  body('source')
    .optional()
    .trim()
    .notEmpty().withMessage('Source location cannot be empty')
    .isString().withMessage('Source location must be a string'),
  body('destination')
    .optional()
    .trim()
    .notEmpty().withMessage('Destination location cannot be empty')
    .isString().withMessage('Destination location must be a string'),
  body('vehicle')
    .optional()
    .isMongoId().withMessage('Vehicle ID must be a valid Mongo ID'),
  body('driver')
    .optional()
    .isMongoId().withMessage('Driver ID must be a valid Mongo ID'),
  body('cargoWeight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Cargo weight must be a positive number'),
  body('plannedDistance')
    .optional()
    .isFloat({ min: 0 }).withMessage('Planned distance must be a positive number'),
  body('expectedRevenue')
    .optional()
    .isFloat({ min: 0 }).withMessage('Expected revenue must be a positive number'),
  body('remarks')
    .optional()
    .trim()
    .isString().withMessage('Remarks must be a string'),
  handleValidationErrors,
];

export const dispatchTripValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Trip ID'),
  handleValidationErrors,
];

export const completeTripValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Trip ID'),
  body('actualDistance')
    .notEmpty().withMessage('Actual distance is required')
    .isFloat({ min: 0 }).withMessage('Actual distance must be a positive number'),
  body('fuelConsumed')
    .notEmpty().withMessage('Fuel consumed is required')
    .isFloat({ min: 0 }).withMessage('Fuel consumed must be a positive number'),
  body('endOdometer')
    .notEmpty().withMessage('End odometer reading is required')
    .isFloat({ min: 0 }).withMessage('End odometer reading must be a positive number'),
  handleValidationErrors,
];

export const cancelTripValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Trip ID'),
  handleValidationErrors,
];

export const getTripByIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Trip ID'),
  handleValidationErrors,
];

export const deleteTripValidation = [
  param('id')
    .isMongoId().withMessage('Invalid Trip ID'),
  handleValidationErrors,
];
