import { body, param, validationResult } from 'express-validator';

// Middleware helper to handle and format validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Shared body validation rules to prevent code duplication
const vehicleBodyValidationRules = [
  body('registrationNumber')
    .trim()
    .notEmpty().withMessage('Registration number is required')
    .isLength({ min: 5, max: 20 }).withMessage('Registration number must be between 5 and 20 characters'),

  body('vehicleName')
    .trim()
    .notEmpty().withMessage('Vehicle name is required')
    .isLength({ min: 2 }).withMessage('Vehicle name must be at least 2 characters'),

  body('vehicleModel')
    .trim()
    .notEmpty().withMessage('Vehicle model is required'),

  body('vehicleType')
    .trim()
    .notEmpty().withMessage('Vehicle type is required')
    .isIn(['Truck', 'Van', 'Mini Truck', 'Pickup', 'Trailer', 'Other'])
    .withMessage('Vehicle type must be one of: Truck, Van, Mini Truck, Pickup, Trailer, Other'),

  body('maximumLoadCapacity')
    .notEmpty().withMessage('Maximum load capacity is required')
    .isFloat({ gt: 0 }).withMessage('Maximum load capacity must be a numeric value greater than 0'),

  body('odometer')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Odometer reading cannot be negative'),

  body('acquisitionCost')
    .notEmpty().withMessage('Acquisition cost is required')
    .isFloat({ gt: 0 }).withMessage('Acquisition cost must be a positive number'),

  body('status')
    .optional()
    .trim()
    .isIn(['Available', 'On Trip', 'In Shop', 'Retired'])
    .withMessage('Status must be one of: Available, On Trip, In Shop, Retired'),

  body('region')
    .optional()
    .trim(),
];

// Validation rules for POST /vehicles (Create)
export const createVehicleValidation = [
  ...vehicleBodyValidationRules,
  handleValidationErrors,
];

// Validation rules for PUT /vehicles/:id (Update)
export const updateVehicleValidation = [
  param('id')
    .trim()
    .isMongoId().withMessage('Invalid vehicle ID format'),
  ...vehicleBodyValidationRules,
  handleValidationErrors,
];
