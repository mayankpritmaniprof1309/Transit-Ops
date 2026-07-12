import { Router } from 'express';
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getAvailableVehicles,
  getVehiclesByStatus,
} from '../controllers/vehicle.controller.js';
import {
  createVehicleSchema,
  updateVehicleSchema,
} from '../validations/vehicle.validation.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validation.js';

const router = Router();

// GET /vehicles/available (must be defined before /:id)
router.get('/available', protect, getAvailableVehicles);

// GET /vehicles/status/:status (must be defined before /:id)
router.get('/status/:status', protect, getVehiclesByStatus);

// GET /vehicles
router.get('/', protect, getAllVehicles);

// GET /vehicles/:id
router.get('/:id', protect, getVehicleById);

// POST /vehicles
router.post(
  '/',
  protect,
  restrictTo('Fleet Manager'),
  validate(createVehicleSchema),
  createVehicle
);

// PUT /vehicles/:id
router.put(
  '/:id',
  protect,
  restrictTo('Fleet Manager'),
  validate(updateVehicleSchema),
  updateVehicle
);

// DELETE /vehicles/:id
router.delete(
  '/:id',
  protect,
  restrictTo('Fleet Manager'),
  deleteVehicle
);

export default router;
