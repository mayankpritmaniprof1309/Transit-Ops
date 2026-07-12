import { Router } from 'express';
import * as tripController from '../controllers/trip.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import * as tripValidation from '../validations/trip.validation.js';

const router = Router();

// Define roles with their access levels
const ALL_ROLES = ['Fleet Manager', 'Dispatcher', 'Financial Analyst', 'Safety Officer'];
const FULL_ACCESS_ROLES = ['Fleet Manager', 'Dispatcher'];

/**
 * GET /
 * Get all trips.
 * Accessible to Fleet Manager, Dispatcher, Financial Analyst, Safety Officer.
 */
router.get(
  '/',
  authenticate,
  authorize(...ALL_ROLES),
  tripController.getAllTrips
);

/**
 * GET /:id
 * Get a specific trip by ID.
 * Accessible to Fleet Manager, Dispatcher, Financial Analyst, Safety Officer.
 */
router.get(
  '/:id',
  authenticate,
  authorize(...ALL_ROLES),
  tripValidation.getTripByIdValidation,
  tripController.getTripById
);

/**
 * POST /
 * Create a new trip (Draft status).
 * Accessible to Fleet Manager, Dispatcher.
 */
router.post(
  '/',
  authenticate,
  authorize(...FULL_ACCESS_ROLES),
  tripValidation.createTripValidation,
  tripController.createTrip
);

/**
 * PUT /:id
 * Update a trip (Draft trips only).
 * Accessible to Fleet Manager, Dispatcher.
 */
router.put(
  '/:id',
  authenticate,
  authorize(...FULL_ACCESS_ROLES),
  tripValidation.updateTripValidation,
  tripController.updateTrip
);

/**
 * DELETE /:id
 * Delete a trip (Draft or Cancelled status only).
 * Accessible to Fleet Manager, Dispatcher.
 */
router.delete(
  '/:id',
  authenticate,
  authorize(...FULL_ACCESS_ROLES),
  tripValidation.deleteTripValidation,
  tripController.deleteTrip
);

/**
 * PATCH /:id/dispatch
 * Dispatch a draft trip (Draft -> Dispatched).
 * Accessible to Fleet Manager, Dispatcher.
 */
router.patch(
  '/:id/dispatch',
  authenticate,
  authorize(...FULL_ACCESS_ROLES),
  tripValidation.dispatchTripValidation,
  tripController.dispatchTrip
);

/**
 * PATCH /:id/complete
 * Complete an active trip (Dispatched -> Completed).
 * Accessible to Fleet Manager, Dispatcher.
 */
router.patch(
  '/:id/complete',
  authenticate,
  authorize(...FULL_ACCESS_ROLES),
  tripValidation.completeTripValidation,
  tripController.completeTrip
);

/**
 * PATCH /:id/cancel
 * Cancel a draft or dispatched trip.
 * Accessible to Fleet Manager, Dispatcher.
 */
router.patch(
  '/:id/cancel',
  authenticate,
  authorize(...FULL_ACCESS_ROLES),
  tripValidation.cancelTripValidation,
  tripController.cancelTrip
);

export default router;
