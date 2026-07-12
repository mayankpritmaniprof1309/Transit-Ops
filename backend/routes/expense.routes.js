import { Router } from 'express';
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByVehicle,
  getExpensesByType,
  getExpenseStatistics,
} from '../controllers/expense.controller.js';
import {
  createExpenseValidation,
  updateExpenseValidation,
  validateRequest,
} from '../validations/expense.validation.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = Router();

// Protect all expense routes using authentication middleware
router.use(protect);

// GET /expenses/statistics (must be defined before /:id)
router.get('/statistics', restrictTo('Fleet Manager', 'Financial Analyst'), getExpenseStatistics);

// GET /expenses/vehicle/:vehicleId (must be defined before /:id)
router.get('/vehicle/:vehicleId', getExpensesByVehicle);

// GET /expenses/type/:expenseType (must be defined before /:id)
router.get('/type/:expenseType', getExpensesByType);

// GET /expenses
router.get('/', restrictTo('Fleet Manager', 'Financial Analyst'), getAllExpenses);

// GET /expenses/:id
router.get('/:id', getExpenseById);

// POST /expenses
router.post(
  '/',
  restrictTo('Fleet Manager', 'Financial Analyst'),
  createExpenseValidation,
  validateRequest,
  createExpense
);

// PUT /expenses/:id
router.put(
  '/:id',
  restrictTo('Fleet Manager', 'Financial Analyst'),
  updateExpenseValidation,
  validateRequest,
  updateExpense
);

// DELETE /expenses/:id
router.delete('/:id', restrictTo('Fleet Manager'), deleteExpense);

export default router;
