import * as authService from '../services/auth.service.js';
import {
  createUserSchema,
  updateUserSchema,
  loginUserSchema,
} from '../validations/auth.validation.js';

/**
 * Create user / Register
 */
export const createUser = async (req, res, next) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join(', '));
      err.statusCode = 400;
      return next(err);
    }

    const user = await authService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user
 */
export const loginUser = async (req, res, next) => {
  try {
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join(', '));
      err.statusCode = 400;
      return next(err);
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers(req.query);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user
 */
export const updateUser = async (req, res, next) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join(', '));
      err.statusCode = 400;
      return next(err);
    }

    const user = await authService.updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await authService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (err) {
    next(err);
  }
};
