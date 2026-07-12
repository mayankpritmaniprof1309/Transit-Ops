import express from 'express';
import * as DriverController from '../controllers/driver.controllers.js';

const router = express.Router();

// Route: /api/drivers
router.post('/', DriverController.createDriver);
router.get('/', DriverController.getDrivers);
router.get('/:id', DriverController.getDriverById);
router.put('/:id', DriverController.updateDriver);
router.delete('/:id', DriverController.deleteDriver);

export default router;
