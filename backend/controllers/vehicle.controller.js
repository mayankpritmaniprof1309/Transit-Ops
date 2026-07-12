import * as vehicleService from '../services/vehicle.service.js';

/**
 * Create a new vehicle.
 * POST /vehicles
 */
export const createVehicle = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const vehicle = await vehicleService.createVehicle(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve all vehicles with pagination, search, filtering, and sorting.
 * GET /vehicles
 */
export const getAllVehicles = async (req, res) => {
  try {
    const result = await vehicleService.getAllVehicles(req.query);
    return res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve a single vehicle by ID.
 * GET /vehicles/:id
 */
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);
    return res.status(200).json({
      success: true,
      message: 'Vehicle retrieved successfully',
      data: vehicle,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update a vehicle by ID.
 * PUT /vehicles/:id
 */
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.updateVehicle(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete a vehicle by ID.
 * DELETE /vehicles/:id
 */
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.deleteVehicle(id);
    return res.status(200).json({
      success: true,
      message: result.message || 'Vehicle deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve all vehicles with status "Available".
 * GET /vehicles/available
 */
export const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAvailableVehicles();
    return res.status(200).json({
      success: true,
      message: 'Available vehicles retrieved successfully',
      data: vehicles,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve vehicles by status.
 * GET /vehicles/status/:status
 */
export const getVehiclesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const vehicles = await vehicleService.getVehiclesByStatus(status);
    return res.status(200).json({
      success: true,
      message: `Vehicles with status '${status}' retrieved successfully`,
      data: vehicles,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
