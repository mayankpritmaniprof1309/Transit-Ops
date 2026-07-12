import express from 'express';
import * as FuelController from '../controllers/fuel.controllers.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validation.js';
import { createFuelLogSchema, updateFuelLogSchema } from '../validations/fuel.validations.js';

const router = express.Router();

// All fuel log routes require authentication
router.use(protect);

// GET routes - accessible to all authenticated users
router.get('/', FuelController.getFuelLogs);
router.get('/:id', FuelController.getFuelLogById);

// Mutation routes - Fleet Manager and Financial Analyst, with validation
router.post('/', restrictTo('Fleet Manager', 'Financial Analyst'), validate(createFuelLogSchema), FuelController.createFuelLog);
router.put('/:id', restrictTo('Fleet Manager', 'Financial Analyst'), validate(updateFuelLogSchema), FuelController.updateFuelLog);
router.delete('/:id', restrictTo('Fleet Manager'), FuelController.deleteFuelLog);

export default router;
