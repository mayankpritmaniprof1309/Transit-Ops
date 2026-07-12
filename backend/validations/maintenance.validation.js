import Joi from 'joi';

// Helper for Joi Mongo ObjectId validation
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('Invalid ID format');
  }
  return value;
};

export const createMaintenanceSchema = Joi.object({
  vehicle: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      'any.required': 'Vehicle reference is required',
    }),

  maintenanceType: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'any.required': 'Maintenance type is required',
      'string.min': 'Maintenance type must be at least 3 characters',
      'string.max': 'Maintenance type cannot exceed 100 characters',
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),

  maintenanceDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Maintenance date is required',
    }),

  completionDate: Joi.date()
    .allow(null, '')
    .optional(),

  cost: Joi.number()
    .min(0)
    .required()
    .messages({
      'any.required': 'Cost is required',
      'number.min': 'Cost must be greater than or equal to 0',
    }),

  maintenanceStatus: Joi.string()
    .valid('Pending', 'In Progress', 'Completed')
    .default('Pending')
    .messages({
      'any.only': 'Status must be one of: Pending, In Progress, Completed',
    }),

  technicianName: Joi.string()
    .trim()
    .min(2)
    .allow(null, '')
    .optional()
    .messages({
      'string.min': 'Technician name must be at least 2 characters',
    }),

  remarks: Joi.string()
    .trim()
    .max(500)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Remarks cannot exceed 500 characters',
    }),
});

export const updateMaintenanceSchema = Joi.object({
  vehicle: Joi.string()
    .custom(objectId)
    .optional(),

  maintenanceType: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Maintenance type must be at least 3 characters',
      'string.max': 'Maintenance type cannot exceed 100 characters',
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),

  maintenanceDate: Joi.date()
    .optional(),

  completionDate: Joi.date()
    .allow(null, '')
    .optional(),

  cost: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Cost must be greater than or equal to 0',
    }),

  maintenanceStatus: Joi.string()
    .valid('Pending', 'In Progress', 'Completed')
    .optional()
    .messages({
      'any.only': 'Status must be one of: Pending, In Progress, Completed',
    }),

  technicianName: Joi.string()
    .trim()
    .min(2)
    .allow(null, '')
    .optional()
    .messages({
      'string.min': 'Technician name must be at least 2 characters',
    }),

  remarks: Joi.string()
    .trim()
    .max(500)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Remarks cannot exceed 500 characters',
    }),
});

export const completeMaintenanceSchema = Joi.object({
  completionDate: Joi.date()
    .allow(null, '')
    .optional(),

  remarks: Joi.string()
    .trim()
    .max(500)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Remarks cannot exceed 500 characters',
    }),

  cost: Joi.number()
    .min(0)
    .allow(null, '')
    .optional()
    .messages({
      'number.min': 'Cost must be greater than or equal to 0',
    }),
});
