import { body, validationResult } from 'express-validator';

/**
 * Reusable middleware to validate request and format errors.
 */
export const validateRequest = (req, res, next) => {
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

// Common validation chains for Expense fields
const commonExpenseValidationRules = [
  body('vehicle')
    .trim()
    .notEmpty().withMessage('Vehicle is required')
    .isMongoId().withMessage('Vehicle must be a valid MongoDB ObjectId'),

  body('trip')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isMongoId().withMessage('Trip must be a valid MongoDB ObjectId'),

  body('expenseType')
    .trim()
    .notEmpty().withMessage('Expense type is required')
    .isIn(['Fuel', 'Maintenance', 'Toll', 'Insurance', 'Repair', 'Other'])
    .withMessage('Expense type must be one of: Fuel, Maintenance, Toll, Insurance, Repair, Other'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than zero.'),

  body('expenseDate')
    .notEmpty().withMessage('Expense date is required')
    .isISO8601().withMessage('Expense date must be a valid ISO Date'),

  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('paymentMethod')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['Cash', 'Card', 'UPI', 'Bank Transfer'])
    .withMessage('Payment method must be one of: Cash, Card, UPI, Bank Transfer'),

  body('receiptUrl')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL().withMessage('Receipt URL must be a valid URL'),
];

// Validation array for creating an expense
export const createExpenseValidation = [...commonExpenseValidationRules];

// Validation array for updating an expense
export const updateExpenseValidation = [...commonExpenseValidationRules];
