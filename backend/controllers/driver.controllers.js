import * as DriverService from '../services/driver.services.js';
import { validateCreateDriver } from '../validations/driver.validations.js';

export const createDriver = async (req, res) => {
  try {
    const errors = validateCreateDriver(req.body);
    if (errors.length > 0) return res.status(400).json({ success: false, errors });

    // Fallback createdBy if req.user is not set by middleware yet
    const createdBy = req.user ? req.user._id : null;
    if (!createdBy && req.body.createdBy) {
      // if we don't have auth middleware yet, allow passing it in body for testing
      req.body.createdBy = req.body.createdBy;
    } else {
      req.body.createdBy = createdBy;
    }

    const driver = await DriverService.createDriver(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'License number already exists.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDrivers = async (req, res) => {
  try {
    // Optional query filters (e.g. ?status=Available)
    const filter = req.query.status ? { status: req.query.status } : {};

    const drivers = await DriverService.getDrivers(filter);
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const driver = await DriverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await DriverService.updateDriver(req.params.id, req.body);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const driver = await DriverService.deleteDriver(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.status(200).json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
