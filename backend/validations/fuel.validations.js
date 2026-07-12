import Joi from 'joi';

export const createFuelLogSchema = Joi.object({
  vehicle: Joi.string().required().messages({'any.required': 'Vehicle reference is required'}),
  trip: Joi.string().allow(null, '').optional(),
  fuelQuantity: Joi.number().min(0).required().messages({'any.required': 'Fuel quantity is required', 'number.min': 'Fuel quantity cannot be negative'}),
  fuelCost: Joi.number().min(0).required().messages({'any.required': 'Fuel cost is required', 'number.min': 'Fuel cost cannot be negative'}),
  fuelStation: Joi.string().trim().allow(null, '').optional(),
  fuelDate: Joi.date().required().messages({'any.required': 'Fuel date is required'}),
  odometerReading: Joi.number().min(0).required().messages({'any.required': 'Odometer reading is required', 'number.min': 'Odometer reading cannot be negative'}),
  remarks: Joi.string().trim().allow(null, '').optional(),
  createdBy: Joi.string().allow(null, '').optional()
});
