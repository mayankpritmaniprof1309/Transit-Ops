import * as tripService from '../services/trip.service.js';

/**
 * Helper to determine appropriate HTTP status code based on error message.
 */
const getErrorStatusCode = (error) => {
  const msg = error.message.toLowerCase();
  if (msg.includes('not found') || msg.includes('exist')) {
    return 404;
  }
  if (msg.includes('unauthorized') || msg.includes('access denied')) {
    return 401;
  }
  if (msg.includes('forbidden') || msg.includes('permission')) {
    return 403;
  }
  return 400; // Default to Bad Request for business rule and validation errors
};

/**
 * POST /
 * Create a new trip (Draft).
 */
export const createTrip = async (req, res) => {
  try {
    // req.user is populated by the authenticate middleware
    const trip = await tripService.createTrip(req.body, req.user._id);
    return res.status(201).json({
      success: true,
      message: 'Trip created successfully as Draft.',
      data: trip,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /
 * Retrieve all trips with optional query filters.
 */
export const getAllTrips = async (req, res) => {
  try {
    const trips = await tripService.getAllTrips(req.query);
    return res.status(200).json({
      success: true,
      message: 'Trips retrieved successfully.',
      data: trips,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /:id
 * Retrieve a specific trip by its ID.
 */
export const getTripById = async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Trip retrieved successfully.',
      data: trip,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PUT /:id
 * Update a trip (Draft trips only).
 */
export const updateTrip = async (req, res) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.body, req.user._id);
    return res.status(200).json({
      success: true,
      message: 'Trip updated successfully.',
      data: trip,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /:id
 * Delete a trip (Draft or Cancelled status only).
 */
export const deleteTrip = async (req, res) => {
  try {
    const trip = await tripService.deleteTrip(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Trip deleted successfully.',
      data: trip,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /:id/dispatch
 * Dispatch a draft trip (Draft -> Dispatched).
 */
export const dispatchTrip = async (req, res) => {
  try {
    const trip = await tripService.dispatchTrip(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Trip dispatched successfully.',
      data: trip,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /:id/complete
 * Complete an active trip (Dispatched -> Completed).
 */
export const completeTrip = async (req, res) => {
  try {
    const trip = await tripService.completeTrip(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Trip completed successfully.',
      data: trip,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PATCH /:id/cancel
 * Cancel a draft or dispatched trip (-> Cancelled).
 */
export const cancelTrip = async (req, res) => {
  try {
    const trip = await tripService.cancelTrip(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Trip cancelled successfully.',
      data: trip,
    });
  } catch (error) {
    return res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
};
