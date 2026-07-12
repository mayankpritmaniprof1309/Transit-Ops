import express from 'express';
import * as FuelController from '../controllers/fuel.controllers.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createFuelLogSchema } from '../validations/fuel.validations.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createFuelLogSchema), FuelController.createFuelLog);
router.get('/', FuelController.getFuelLogs);
router.get('/:id', FuelController.getFuelLogById);
router.put('/:id', FuelController.updateFuelLog);
router.delete('/:id', FuelController.deleteFuelLog);

export default router;
