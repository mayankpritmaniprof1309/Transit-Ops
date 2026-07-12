import * as maintenanceService from '../services/maintenance.service.js';

/**
 * Create a new maintenance record.
 * POST /maintenance
 */
export const createMaintenance = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const record = await maintenanceService.createMaintenance(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: record,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve all maintenance records with pagination, search, filtering, and sorting.
 * GET /maintenance
 */
export const getAllMaintenance = async (req, res) => {
  try {
    const result = await maintenanceService.getAllMaintenance(req.query);
    return res.status(200).json({
      success: true,
      message: 'Maintenance records retrieved successfully',
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
 * Retrieve a single maintenance record by ID.
 * GET /maintenance/:id
 */
export const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await maintenanceService.getMaintenanceById(id);
    return res.status(200).json({
      success: true,
      message: 'Maintenance record retrieved successfully',
      data: record,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update a maintenance record by ID.
 * PUT /maintenance/:id
 */
export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await maintenanceService.updateMaintenance(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: record,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete a maintenance record by ID.
 * DELETE /maintenance/:id
 */
export const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await maintenanceService.deleteMaintenance(id);
    return res.status(200).json({
      success: true,
      message: result.message || 'Maintenance record deleted successfully',
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
 * Complete a maintenance record by ID.
 * PATCH /maintenance/:id/complete
 */
export const completeMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await maintenanceService.completeMaintenance(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Maintenance record marked as completed successfully',
      data: record,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieve maintenance records by status.
 * GET /maintenance/status/:status
 */
export const getMaintenanceByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const records = await maintenanceService.getMaintenanceByStatus(status);
    return res.status(200).json({
      success: true,
      message: `Maintenance records with status '${status}' retrieved successfully`,
      data: records,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
