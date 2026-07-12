import * as DriverService from '../services/driver.services.js';

export const createDriver = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const driver = await DriverService.createDriver(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    if (error.code === 11000) {
      return next(new Error('License number already exists.'));
    }
    next(error);
  }
};

export const getDrivers = async (req, res) => {
  try {
    // Optional query filters (e.g. ?status=Available)
    const filter = req.query.status ? { status: req.query.status } : {};

    const drivers = await DriverService.getDrivers(filter);
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    next(error);
  }
};

export const getDriverById = async (req, res) => {
  try {
    const driver = await DriverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await DriverService.updateDriver(req.params.id, req.body);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const driver = await DriverService.deleteDriver(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.status(200).json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    next(error);
  }
};
