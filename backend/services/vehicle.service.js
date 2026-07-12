import Vehicle from '../models/Vehicle.js';

/**
 * Create a new vehicle.
 * @param {Object} vehicleData - The vehicle data.
 * @param {string} userId - The ID of the user creating the vehicle.
 * @returns {Promise<Object>} The created vehicle document.
 */
export const createVehicle = async (vehicleData, userId) => {
  const { registrationNumber } = vehicleData;

  if (registrationNumber) {
    const uppercaseReg = registrationNumber.toUpperCase().trim();
    const existingVehicle = await Vehicle.findOne({ registrationNumber: uppercaseReg });
    if (existingVehicle) {
      throw new Error(`Vehicle with registration number ${registrationNumber} already exists`);
    }
  }

  // Explicitly ensure status defaults to Available if not provided
  if (!vehicleData.status) {
    vehicleData.status = 'Available';
  }

  const newVehicle = new Vehicle({
    ...vehicleData,
    createdBy: userId,
  });

  return await newVehicle.save();
};

/**
 * Get all vehicles with pagination, search, filters, and sorting.
 * @param {Object} queryParams - Query parameters.
 * @returns {Promise<Object>} Object containing vehicles list, totalRecords, currentPage, and totalPages.
 */
export const getAllVehicles = async ({
  page = 1,
  limit = 10,
  search,
  status,
  vehicleType,
  region,
  sortBy,
} = {}) => {
  const query = {};

  // Search by Registration Number, Vehicle Name, or Vehicle Model
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    query.$or = [
      { registrationNumber: searchRegex },
      { vehicleName: searchRegex },
      { vehicleModel: searchRegex },
    ];
  }

  // Filters
  if (status) {
    query.status = status;
  }
  if (vehicleType) {
    query.vehicleType = vehicleType;
  }
  if (region) {
    query.region = region;
  }

  // Sorting
  let sort = { createdAt: -1 }; // Default: Newest
  if (sortBy === 'Newest') {
    sort = { createdAt: -1 };
  } else if (sortBy === 'Oldest') {
    sort = { createdAt: 1 };
  } else if (sortBy === 'Odometer Asc') {
    sort = { odometer: 1 };
  } else if (sortBy === 'Odometer Desc') {
    sort = { odometer: -1 };
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const totalRecords = await Vehicle.countDocuments(query);
  const vehicles = await Vehicle.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parsedLimit)
    .populate('createdBy', 'fullName email role');

  const totalPages = Math.ceil(totalRecords / parsedLimit);

  return {
    vehicles,
    totalRecords,
    currentPage: parsedPage,
    totalPages,
  };
};

/**
 * Retrieve a single vehicle by ID.
 * @param {string} id - The vehicle ID.
 * @returns {Promise<Object>} The vehicle document.
 */
export const getVehicleById = async (id) => {
  const vehicle = await Vehicle.findById(id).populate('createdBy', 'fullName email role');
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  return vehicle;
};

/**
 * Update a vehicle by ID.
 * @param {string} id - The vehicle ID.
 * @param {Object} updateData - Data to update.
 * @returns {Promise<Object>} The updated vehicle document.
 */
export const updateVehicle = async (id, updateData) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // Retired vehicle check: only allow updating status.
  // We compare updated values to current values to allow safe sending of unchanged values in requests.
  if (vehicle.status === 'Retired') {
    const keys = Object.keys(updateData);
    const actualChanges = keys.filter(
      key => updateData[key] !== undefined && String(vehicle[key]) !== String(updateData[key])
    );
    const hasOtherUpdates = actualChanges.some(key => key !== 'status');
    if (hasOtherUpdates) {
      throw new Error('Retired vehicle only allows status updates');
    }
  }

  // Registration number uniqueness check
  if (updateData.registrationNumber) {
    const uppercaseReg = updateData.registrationNumber.toUpperCase().trim();
    if (uppercaseReg !== vehicle.registrationNumber) {
      const duplicateVehicle = await Vehicle.findOne({ registrationNumber: uppercaseReg });
      if (duplicateVehicle) {
        throw new Error(`Vehicle with registration number ${updateData.registrationNumber} already exists`);
      }
    }
  }

  // Update fields
  Object.keys(updateData).forEach(key => {
    vehicle[key] = updateData[key];
  });

  return await vehicle.save();
};

/**
 * Delete a vehicle by ID.
 * @param {string} id - The vehicle ID.
 * @returns {Promise<Object>} Successful delete message.
 */
export const deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  await vehicle.deleteOne();
  return { message: 'Vehicle deleted successfully' };
};

/**
 * Retrieve all vehicles with status "Available".
 * @returns {Promise<Array>} List of available vehicles.
 */
export const getAvailableVehicles = async () => {
  return await Vehicle.find({ status: 'Available' }).populate('createdBy', 'fullName email role');
};

/**
 * Retrieve vehicles by status.
 * @param {string} status - The vehicle status to filter by.
 * @returns {Promise<Array>} List of vehicles matching the status.
 */
export const getVehiclesByStatus = async (status) => {
  return await Vehicle.find({ status }).populate('createdBy', 'fullName email role');
};
