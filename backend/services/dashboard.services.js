import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';

export const getDashboardKPIs = async (filters = {}) => {
  // Promise.all to fetch counts concurrently for better performance
  const [
    totalVehicles,
    availableVehicles,
    activeVehicles, 
    vehiclesInMaintenance,
    totalDrivers,
    availableDrivers,
    driversOnDuty,
    totalTrips,
    activeTrips, 
    pendingTrips 
  ] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: 'Available' }),
    Vehicle.countDocuments({ status: 'On Trip' }),
    Vehicle.countDocuments({ status: 'In Shop' }),
    Driver.countDocuments(),
    Driver.countDocuments({ status: 'Available' }),
    Driver.countDocuments({ status: 'On Trip' }),
    Trip.countDocuments(),
    Trip.countDocuments({ status: 'Dispatched' }),
    Trip.countDocuments({ status: 'Draft' }),
  ]);

  const fleetUtilization = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(2) : 0;

  return {
    totalVehicles,
    availableVehicles,
    activeVehicles,
    vehiclesInMaintenance,
    totalDrivers,
    availableDrivers,
    driversOnDuty,
    totalTrips,
    activeTrips,
    pendingTrips,
    fleetUtilization: Number(fleetUtilization)
  };
};
