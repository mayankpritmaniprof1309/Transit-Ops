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
  createVehicleValidation,
  updateVehicleValidation,
} from '../validations/vehicle.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

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
  authorize('Fleet Manager'),
  createVehicleValidation,
  createVehicle
);

// PUT /vehicles/:id
router.put(
  '/:id',
  protect,
  authorize('Fleet Manager'),
  updateVehicleValidation,
  updateVehicle
);

// DELETE /vehicles/:id
router.delete(
  '/:id',
  protect,
  authorize('Fleet Manager'),
  deleteVehicle
);

export default router;
