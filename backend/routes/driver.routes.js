import express from 'express';
import * as DriverController from '../controllers/driver.controllers.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validation.js';
import { createDriverSchema, updateDriverSchema } from '../validations/driver.validations.js';

const router = express.Router();

// All driver routes require authentication
router.use(protect);

// GET routes - accessible to all authenticated users
router.get('/', DriverController.getDrivers);
router.get('/:id', DriverController.getDriverById);

// Mutation routes - Fleet Manager only, with validation
router.post('/', restrictTo('Fleet Manager'), validate(createDriverSchema), DriverController.createDriver);
router.put('/:id', restrictTo('Fleet Manager'), validate(updateDriverSchema), DriverController.updateDriver);
router.delete('/:id', restrictTo('Fleet Manager'), DriverController.deleteDriver);

export default router;
