import Driver from '../models/Driver.js';

export const createDriver = async (driverData) => {
  const driver = new Driver(driverData);
  return await driver.save();
};

export const getDrivers = async (filter = {}) => {
  return await Driver.find(filter).populate('createdBy', 'email role');
};

export const getDriverById = async (id) => {
  return await Driver.findById(id).populate('createdBy', 'email role');
};

export const updateDriver = async (id, updateData) => {
  return await Driver.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteDriver = async (id) => {
  return await Driver.findByIdAndDelete(id);
};
