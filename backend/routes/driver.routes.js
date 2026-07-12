import express from 'express';
import * as DriverController from '../controllers/driver.controllers.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createDriverSchema } from '../validations/driver.validations.js';

const router = express.Router();

router.use(protect);

// Route: /api/drivers
router.post('/', validate(createDriverSchema), DriverController.createDriver);
router.get('/', DriverController.getDrivers);
router.get('/:id', DriverController.getDriverById);
router.put('/:id', DriverController.updateDriver);
router.delete('/:id', DriverController.deleteDriver);

export default router;
