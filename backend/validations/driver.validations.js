import Joi from 'joi';

export const createDriverSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({'any.required': 'Full name is required'}),
  licenseNumber: Joi.string().trim().uppercase().required().messages({'any.required': 'License number is required'}),
  licenseCategory: Joi.string().trim().required().messages({'any.required': 'License category is required'}),
  licenseExpiryDate: Joi.date().required().messages({'any.required': 'License expiry date is required'}),
  contactNumber: Joi.string().trim().required().messages({'any.required': 'Contact number is required'}),
  email: Joi.string().email().trim().allow(null, '').optional(),
  safetyScore: Joi.number().min(0).max(100).default(100),
  status: Joi.string().valid('Available', 'On Trip', 'Off Duty', 'Suspended').default('Available'),
  address: Joi.string().trim().allow(null, '').optional(),
  emergencyContact: Joi.string().trim().allow(null, '').optional(),
  createdBy: Joi.string().allow(null, '').optional()
});

export const updateDriverSchema = Joi.object({
  fullName: Joi.string().trim().optional(),
  licenseNumber: Joi.string().trim().uppercase().optional(),
  licenseCategory: Joi.string().trim().optional(),
  licenseExpiryDate: Joi.date().optional(),
  contactNumber: Joi.string().trim().optional(),
  email: Joi.string().email().trim().allow(null, '').optional(),
  safetyScore: Joi.number().min(0).max(100).optional(),
  status: Joi.string().valid('Available', 'On Trip', 'Off Duty', 'Suspended').optional(),
  address: Joi.string().trim().allow(null, '').optional(),
  emergencyContact: Joi.string().trim().allow(null, '').optional(),
});
