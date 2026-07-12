import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';

/**
 * Reusable helper method to validate Vehicle and Driver business rules.
 */
const validateVehicleAndDriverForTrip = async (vehicleId, driverId, cargoWeight, currentTripId = null) => {
  // 1. Validate Vehicle existence and status
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle must exist.');
  }
  if (vehicle.status === 'Retired') {
    throw new Error('Vehicle cannot be Retired.');
  }
  if (vehicle.status === 'In Shop') {
    throw new Error('Vehicle cannot be In Shop.');
  }
  if (vehicle.status === 'On Trip') {
    throw new Error('Vehicle cannot already be On Trip.');
  }
  if (vehicle.status !== 'Available') {
    throw new Error('Vehicle status must be Available.');
  }

  // 2. Validate Driver existence and status
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver must exist.');
  }
  if (driver.status === 'Suspended') {
    throw new Error('Driver cannot be Suspended.');
  }
  if (driver.status === 'On Trip') {
    throw new Error('Driver cannot already be On Trip.');
  }
  if (driver.status !== 'Available') {
    throw new Error('Driver status must be Available.');
  }

  // 3. Validate Driver license expiration
  if (new Date(driver.licenseExpiryDate) < new Date()) {
    throw new Error('Driver license must not be expired.');
  }

  // 4. Ensure Driver is not already assigned to another active (Dispatched) trip
  const activeTrip = await Trip.findOne({
    driver: driverId,
    tripStatus: 'Dispatched',
    _id: { $ne: currentTripId },
  });
  if (activeTrip) {
    throw new Error('Driver cannot already be assigned to another active trip.');
  }

  // 5. Ensure Cargo Weight does not exceed maximum load capacity
  if (cargoWeight > vehicle.maximumLoadCapacity) {
    throw new Error(`Cargo Weight must not exceed vehicle.maxLoadCapacity. (Cargo: ${cargoWeight}, Capacity: ${vehicle.maximumLoadCapacity})`);
  }

  return { vehicle, driver };
};

/**
 * Create a new trip (Draft status).
 */
export const createTrip = async (tripData, userId) => {
  const {
    tripNumber,
    source,
    destination,
    vehicle: vehicleId,
    driver: driverId,
    cargoWeight,
    plannedDistance,
    expectedRevenue,
    remarks,
  } = tripData;

  // Validate business rules before creating Draft trip
  await validateVehicleAndDriverForTrip(vehicleId, driverId, cargoWeight);

  const newTrip = new Trip({
    tripNumber,
    source,
    destination,
    vehicle: vehicleId,
    driver: driverId,
    cargoWeight,
    plannedDistance,
    expectedRevenue,
    remarks,
    createdBy: userId,
    tripStatus: 'Draft',
  });

  await newTrip.save();
  return await getTripById(newTrip._id);
};

/**
 * Retrieve all trips with filters and populated references.
 */
export const getAllTrips = async (query = {}) => {
  const filter = {};
  if (query.tripStatus) filter.tripStatus = query.tripStatus;
  if (query.vehicle) filter.vehicle = query.vehicle;
  if (query.driver) filter.driver = query.driver;
  if (query.tripNumber) filter.tripNumber = { $regex: query.tripNumber, $options: 'i' };

  return await Trip.find(filter)
    .populate('vehicle')
    .populate('driver')
    .populate('createdBy', 'fullName email role');
};

/**
 * Retrieve a specific trip by its ID with populated references.
 */
export const getTripById = async (id) => {
  const trip = await Trip.findById(id)
    .populate('vehicle')
    .populate('driver')
    .populate('createdBy', 'fullName email role');

  if (!trip) {
    throw new Error('Trip not found');
  }
  return trip;
};

/**
 * Update a trip (Only if it is in Draft status).
 */
export const updateTrip = async (id, updateData, userId) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    throw new Error('Trip not found');
  }

  const allowedUpdates = [
    'tripNumber',
    'source',
    'destination',
    'vehicle',
    'driver',
    'cargoWeight',
    'plannedDistance',
    'expectedRevenue',
    'tripStatus',
    'dispatchDate',
    'completionDate',
    'remarks',
  ];

  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      trip[field] = updateData[field];
    }
  });

  await trip.save();
  return await getTripById(id);
};

/**
 * Delete a trip (Only Draft or Cancelled status).
 */
export const deleteTrip = async (id) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    throw new Error('Trip not found');
  }

  if (trip.tripStatus === 'Dispatched') {
    throw new Error('Cannot delete an active dispatched trip. Cancel it first.');
  }

  if (trip.tripStatus !== 'Draft' && trip.tripStatus !== 'Cancelled') {
    throw new Error(`Cannot delete a trip with status ${trip.tripStatus}. Only Draft or Cancelled trips can be deleted.`);
  }

  await Trip.findByIdAndDelete(id);
  return trip;
};

/**
 * Dispatch a trip: transitions Draft -> Dispatched.
 * Updates vehicle and driver status to "On Trip".
 * Uses a Mongoose transaction.
 */
export const dispatchTrip = async (id) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    throw new Error('Trip not found');
  }

  if (trip.tripStatus !== 'Draft') {
    throw new Error(`Only Draft trips can be dispatched. Current status is ${trip.tripStatus}`);
  }

  // Fetch and validate the driver and vehicle status
  const { vehicle, driver } = await validateVehicleAndDriverForTrip(
    trip.vehicle,
    trip.driver,
    trip.cargoWeight,
    id
  );

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update Trip details
    trip.tripStatus = 'Dispatched';
    trip.dispatchDate = new Date();
    trip.startOdometer = vehicle.odometer; // Set starting odometer from current vehicle odometer
    await trip.save({ session });

    // 2. Update Vehicle Status
    vehicle.status = 'On Trip';
    await vehicle.save({ session });

    // 3. Update Driver Status
    driver.status = 'On Trip';
    await driver.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return await getTripById(id);
};

/**
 * Complete a trip: transitions Dispatched -> Completed.
 * Updates vehicle and driver status back to "Available".
 * Updates completionDate, actualDistance, fuelConsumed, endOdometer on the Trip.
 * Updates the vehicle's odometer to endOdometer.
 * Uses a Mongoose transaction.
 */
export const completeTrip = async (id, completionData) => {
  const { actualDistance, fuelConsumed, endOdometer } = completionData;

  const trip = await Trip.findById(id);
  if (!trip) {
    throw new Error('Trip not found');
  }

  if (trip.tripStatus !== 'Dispatched') {
    throw new Error(`Only Dispatched trips can be completed. Current status is ${trip.tripStatus}`);
  }

  const vehicle = await Vehicle.findById(trip.vehicle);
  if (!vehicle) {
    throw new Error('Vehicle assigned to this trip was not found.');
  }

  const driver = await Driver.findById(trip.driver);
  if (!driver) {
    throw new Error('Driver assigned to this trip was not found.');
  }

  // Validate end odometer reading
  const startOdo = trip.startOdometer || 0;
  if (endOdometer < startOdo) {
    throw new Error(`End odometer (${endOdometer}) cannot be less than start odometer (${startOdo}).`);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update Trip details
    trip.tripStatus = 'Completed';
    trip.completionDate = new Date();
    trip.actualDistance = actualDistance;
    trip.fuelConsumed = fuelConsumed;
    trip.endOdometer = endOdometer;
    await trip.save({ session });

    // 2. Update Vehicle details (Status Available, update odometer)
    vehicle.status = 'Available';
    vehicle.odometer = endOdometer;
    await vehicle.save({ session });

    // 3. Update Driver details (Status Available)
    driver.status = 'Available';
    await driver.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return await getTripById(id);
};

/**
 * Cancel a trip: transitions Draft/Dispatched -> Cancelled.
 * Restores vehicle and driver status back to "Available".
 * Uses a Mongoose transaction.
 */
export const cancelTrip = async (id) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    throw new Error('Trip not found');
  }

  if (trip.tripStatus !== 'Draft' && trip.tripStatus !== 'Dispatched') {
    throw new Error(`Cannot cancel a trip with status ${trip.tripStatus}. Only Draft or Dispatched trips can be cancelled.`);
  }

  const wasDispatched = trip.tripStatus === 'Dispatched';

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update Trip status to Cancelled
    trip.tripStatus = 'Cancelled';
    await trip.save({ session });

    // 2. Restore vehicle and driver status to Available if it was Dispatched
    if (wasDispatched) {
      const vehicle = await Vehicle.findById(trip.vehicle);
      if (vehicle) {
        vehicle.status = 'Available';
        await vehicle.save({ session });
      }

      const driver = await Driver.findById(trip.driver);
      if (driver) {
        driver.status = 'Available';
        await driver.save({ session });
      }
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return await getTripById(id);
};
