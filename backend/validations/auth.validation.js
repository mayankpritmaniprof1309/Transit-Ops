import Joi from 'joi';

const roles = ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst', 'Dispatcher'];

export const createUserSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    'string.empty': 'Full name is required',
    'any.required': 'Full name is required',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid(...roles).required().messages({
    'string.empty': 'Role is required',
    'any.only': 'Invalid role selected',
    'any.required': 'Role is required',
  }),
  phone: Joi.string().trim().allow('').optional(),
  profileImage: Joi.string().trim().allow('').optional(),
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional().messages({
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().min(8).optional().messages({
    'string.min': 'Password must be at least 8 characters long',
  }),
  role: Joi.string().valid(...roles).optional().messages({
    'any.only': 'Invalid role selected',
  }),
  phone: Joi.string().trim().allow('').optional(),
  profileImage: Joi.string().trim().allow('').optional(),
  isActive: Joi.boolean().optional(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});
