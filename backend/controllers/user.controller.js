import * as userService from '../services/user.service.js';
import {
  createUserSchema,
  updateUserSchema,
  loginUserSchema,
} from '../validations/user.validation.js';

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

    const user = await userService.createUser(req.body);

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
    const result = await userService.loginUser(email, password);

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
    const users = await userService.getAllUsers(req.query);

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
    const user = await userService.getUserById(req.params.id);

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

    const user = await userService.updateUser(req.params.id, req.body);

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
    const user = await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
