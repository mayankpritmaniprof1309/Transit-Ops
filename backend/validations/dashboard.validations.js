import Joi from 'joi';

export const getDashboardQuerySchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  region: Joi.string().optional()
});
