import { Router } from 'express';
import {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  completeMaintenance,
  getMaintenanceByStatus,
} from '../controllers/maintenance.controller.js';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  completeMaintenanceSchema,
} from '../validations/maintenance.validation.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validation.js';

const router = Router();

// GET /maintenance/status/:status (must be defined before /:id)
router.get('/status/:status', protect, getMaintenanceByStatus);

// GET /maintenance
router.get('/', protect, getAllMaintenance);

// GET /maintenance/:id
router.get('/:id', protect, getMaintenanceById);

// POST /maintenance
router.post(
  '/',
  protect,
  restrictTo('Fleet Manager'),
  validate(createMaintenanceSchema),
  createMaintenance
);

// PUT /maintenance/:id
router.put(
  '/:id',
  protect,
  restrictTo('Fleet Manager'),
  validate(updateMaintenanceSchema),
  updateMaintenance
);

// PATCH /maintenance/:id/complete
router.patch(
  '/:id/complete',
  protect,
  restrictTo('Fleet Manager'),
  validate(completeMaintenanceSchema),
  completeMaintenance
);

// DELETE /maintenance/:id
router.delete(
  '/:id',
  protect,
  restrictTo('Fleet Manager'),
  deleteMaintenance
);

export default router;
