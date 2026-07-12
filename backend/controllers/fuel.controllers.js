import * as FuelService from '../services/fuel.services.js';

export const createFuelLog = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const fuelLog = await FuelService.createFuelLog(req.body);
    res.status(201).json({ success: true, data: fuelLog });
  } catch (error) {
    next(error);
  }
};

export const getFuelLogs = async (req, res) => {
  try {
    const filter = req.query.vehicle ? { vehicle: req.query.vehicle } : {};
    const fuelLogs = await FuelService.getFuelLogs(filter);
    res.status(200).json({ success: true, data: fuelLogs });
  } catch (error) {
    next(error);
  }
};

export const getFuelLogById = async (req, res) => {
  try {
    const fuelLog = await FuelService.getFuelLogById(req.params.id);
    if (!fuelLog) return res.status(404).json({ success: false, message: 'Fuel log not found' });
    res.status(200).json({ success: true, data: fuelLog });
  } catch (error) {
    next(error);
  }
};

export const updateFuelLog = async (req, res) => {
  try {
    const fuelLog = await FuelService.updateFuelLog(req.params.id, req.body);
    if (!fuelLog) return res.status(404).json({ success: false, message: 'Fuel log not found' });
    res.status(200).json({ success: true, data: fuelLog });
  } catch (error) {
    next(error);
  }
};

export const deleteFuelLog = async (req, res) => {
  try {
    const fuelLog = await FuelService.deleteFuelLog(req.params.id);
    if (!fuelLog) return res.status(404).json({ success: false, message: 'Fuel log not found' });
    res.status(200).json({ success: true, message: 'Fuel log deleted successfully' });
  } catch (error) {
    next(error);
  }
};
