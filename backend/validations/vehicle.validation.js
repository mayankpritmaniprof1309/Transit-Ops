import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  registrationNumber: Joi.string()
    .trim()
    .uppercase()
    .min(5)
    .max(20)
    .required()
    .messages({
      'any.required': 'Registration number is required',
      'string.min': 'Registration number must be at least 5 characters',
      'string.max': 'Registration number cannot exceed 20 characters',
    }),

  vehicleName: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      'any.required': 'Vehicle name is required',
      'string.min': 'Vehicle name must be at least 2 characters',
    }),

  vehicleModel: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Vehicle model is required',
    }),

  vehicleType: Joi.string()
    .trim()
    .valid('Truck', 'Van', 'Mini Truck', 'Pickup', 'Trailer', 'Other')
    .required()
    .messages({
      'any.required': 'Vehicle type is required',
      'any.only': 'Vehicle type must be one of: Truck, Van, Mini Truck, Pickup, Trailer, Other',
    }),

  maximumLoadCapacity: Joi.number()
    .greater(0)
    .required()
    .messages({
      'any.required': 'Maximum load capacity is required',
      'number.greater': 'Maximum load capacity must be greater than 0',
    }),

  odometer: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Odometer reading cannot be negative',
    }),

  acquisitionCost: Joi.number()
    .greater(0)
    .required()
    .messages({
      'any.required': 'Acquisition cost is required',
      'number.greater': 'Acquisition cost must be positive',
    }),

  status: Joi.string()
    .valid('Available', 'On Trip', 'In Shop', 'Retired')
    .default('Available')
    .messages({
      'any.only': 'Status must be one of: Available, On Trip, In Shop, Retired',
    }),

  region: Joi.string()
    .trim()
    .allow(null, '')
    .optional(),
});

export const updateVehicleSchema = Joi.object({
  registrationNumber: Joi.string()
    .trim()
    .uppercase()
    .min(5)
    .max(20)
    .optional()
    .messages({
      'string.min': 'Registration number must be at least 5 characters',
      'string.max': 'Registration number cannot exceed 20 characters',
    }),

  vehicleName: Joi.string()
    .trim()
    .min(2)
    .optional()
    .messages({
      'string.min': 'Vehicle name must be at least 2 characters',
    }),

  vehicleModel: Joi.string()
    .trim()
    .optional(),

  vehicleType: Joi.string()
    .trim()
    .valid('Truck', 'Van', 'Mini Truck', 'Pickup', 'Trailer', 'Other')
    .optional()
    .messages({
      'any.only': 'Vehicle type must be one of: Truck, Van, Mini Truck, Pickup, Trailer, Other',
    }),

  maximumLoadCapacity: Joi.number()
    .greater(0)
    .optional()
    .messages({
      'number.greater': 'Maximum load capacity must be greater than 0',
    }),

  odometer: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Odometer reading cannot be negative',
    }),

  acquisitionCost: Joi.number()
    .greater(0)
    .optional()
    .messages({
      'number.greater': 'Acquisition cost must be positive',
    }),

  status: Joi.string()
    .valid('Available', 'On Trip', 'In Shop', 'Retired')
    .optional()
    .messages({
      'any.only': 'Status must be one of: Available, On Trip, In Shop, Retired',
    }),

  region: Joi.string()
    .trim()
    .allow(null, '')
    .optional(),
});
