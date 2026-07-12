import FuelLog from '../models/FuelLog.js';

export const createFuelLog = async (fuelData) => {
  const fuelLog = new FuelLog(fuelData);
  return await fuelLog.save();
};

export const getFuelLogs = async (filter = {}) => {
  return await FuelLog.find(filter)
    .populate('vehicle', 'registrationNumber name type')
    .populate('createdBy', 'email role');
};

export const getFuelLogById = async (id) => {
  return await FuelLog.findById(id)
    .populate('vehicle', 'registrationNumber name type')
    .populate('createdBy', 'email role');
};

export const updateFuelLog = async (id, updateData) => {
  return await FuelLog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteFuelLog = async (id) => {
  return await FuelLog.findByIdAndDelete(id);
};
