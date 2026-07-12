import FuelLog from '../models/FuelLog.js';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';

export const createFuelLog = async (fuelData) => {
  // Verify vehicle exists
  const vehicle = await Vehicle.findById(fuelData.vehicle);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // Verify vehicle is not Retired
  if (vehicle.status === 'Retired') {
    throw new Error('Cannot create fuel log for a retired vehicle');
  }

  // Verify vehicle is not In Shop
  if (vehicle.status === 'In Shop') {
    throw new Error('Cannot create fuel log for a vehicle currently in maintenance');
  }

  // Verify trip exists if tripId is supplied
  if (fuelData.trip) {
    const trip = await Trip.findById(fuelData.trip);
    if (!trip) {
      throw new Error('Trip not found');
    }
  }

  const fuelLog = new FuelLog(fuelData);
  return await fuelLog.save();
};

export const getFuelLogs = async (filter = {}) => {
  return await FuelLog.find(filter)
    .populate('vehicle', 'registrationNumber vehicleName vehicleType')
    .populate('createdBy', 'fullName email role');
};

export const getFuelLogById = async (id) => {
  return await FuelLog.findById(id)
    .populate('vehicle', 'registrationNumber vehicleName vehicleType')
    .populate('createdBy', 'fullName email role');
};

export const updateFuelLog = async (id, updateData) => {
  return await FuelLog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteFuelLog = async (id) => {
  return await FuelLog.findByIdAndDelete(id);
};
