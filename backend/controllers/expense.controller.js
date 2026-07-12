import * as expenseService from '../services/expense.service.js';

/**
 * Create a new expense.
 * POST /expenses
 */
export const createExpense = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const expense = await expenseService.createExpense(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve all expense records with pagination, search, filters, and sorting.
 * GET /expenses
 */
export const getAllExpenses = async (req, res) => {
  try {
    const result = await expenseService.getAllExpenses(req.query);
    return res.status(200).json({
      success: true,
      message: 'Expenses retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve an expense record by ID.
 * GET /expenses/:id
 */
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseService.getExpenseById(id);
    return res.status(200).json({
      success: true,
      message: 'Expense retrieved successfully',
      data: expense,
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update an expense record by ID.
 * PUT /expenses/:id
 */
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseService.updateExpense(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete an expense record by ID.
 * DELETE /expenses/:id
 */
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await expenseService.deleteExpense(id);
    return res.status(200).json({
      success: true,
      message: result.message || 'Expense deleted successfully',
      data: null,
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve all expenses belonging to a specific vehicle.
 * GET /expenses/vehicle/:vehicleId
 */
export const getExpensesByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const expenses = await expenseService.getExpensesByVehicle(vehicleId);
    return res.status(200).json({
      success: true,
      message: 'Expenses for vehicle retrieved successfully',
      data: expenses,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve all expenses of a specific type.
 * GET /expenses/type/:expenseType
 */
export const getExpensesByType = async (req, res) => {
  try {
    const { expenseType } = req.params;
    const expenses = await expenseService.getExpensesByType(expenseType);
    return res.status(200).json({
      success: true,
      message: `Expenses of type '${expenseType}' retrieved successfully`,
      data: expenses,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve aggregated expense statistics.
 * GET /expenses/statistics
 */
export const getExpenseStatistics = async (req, res) => {
  try {
    const stats = await expenseService.getExpenseStatistics();
    return res.status(200).json({
      success: true,
      message: 'Expense statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
