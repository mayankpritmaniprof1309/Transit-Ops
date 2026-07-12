import Maintenance from '../models/Maintenance.js';
import Vehicle from '../models/Vehicle.js';

/**
 * Create a new maintenance record.
 * @param {string} userId - User ID of the creator.
 * @param {Object} maintenanceData - Maintenance data.
 * @returns {Promise<Object>} The created maintenance document.
 */
export const createMaintenance = async (userId, maintenanceData) => {
  const vehicle = await Vehicle.findById(maintenanceData.vehicle);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  if (vehicle.status === 'Retired') {
    throw new Error('Cannot create maintenance for a retired vehicle');
  }

  const maintenance = new Maintenance({
    ...maintenanceData,
    createdBy: userId,
  });

  const savedRecord = await maintenance.save();

  // Automatically update vehicle status to "In Shop"
  vehicle.status = 'In Shop';
  await vehicle.save();

  return savedRecord;
};

/**
 * Retrieve all maintenance records with pagination, search, filters, and sorting.
 * @param {Object} queryParams - Query parameters.
 * @returns {Promise<Object>} Object containing maintenance records list and pagination metadata.
 */
export const getAllMaintenance = async ({
  page = 1,
  limit = 10,
  search,
  maintenanceStatus,
  startDate,
  endDate,
  sortBy,
} = {}) => {
  const query = {};

  // Search by Vehicle, Maintenance Type, or Technician Name
  if (search) {
    // Find matching vehicles based on search term (Registration Number or Name)
    const matchingVehicles = await Vehicle.find({
      $or: [
        { registrationNumber: { $regex: search, $options: 'i' } },
        { vehicleName: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    const vehicleIds = matchingVehicles.map(v => v._id);

    query.$or = [
      { vehicle: { $in: vehicleIds } },
      { maintenanceType: { $regex: search, $options: 'i' } },
      { technicianName: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter: Maintenance Status
  if (maintenanceStatus) {
    query.maintenanceStatus = maintenanceStatus;
  }

  // Filter: Date Range (maintenanceDate)
  if (startDate || endDate) {
    query.maintenanceDate = {};
    if (startDate) {
      query.maintenanceDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.maintenanceDate.$lte = new Date(endDate);
    }
  }

  // Sorting
  let sort = { createdAt: -1 }; // Default sorting
  if (sortBy === 'Newest') {
    sort = { maintenanceDate: -1 };
  } else if (sortBy === 'Oldest') {
    sort = { maintenanceDate: 1 };
  } else if (sortBy === 'Cost') {
    sort = { cost: -1 };
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const totalRecords = await Maintenance.countDocuments(query);
  const maintenanceRecords = await Maintenance.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parsedLimit)
    .populate('vehicle')
    .populate('createdBy', 'fullName email role');

  const totalPages = Math.ceil(totalRecords / parsedLimit);

  return {
    maintenanceRecords,
    totalRecords,
    currentPage: parsedPage,
    totalPages,
  };
};

/**
 * Retrieve maintenance details by ID.
 * @param {string} id - The maintenance ID.
 * @returns {Promise<Object>} The maintenance document.
 */
export const getMaintenanceById = async (id) => {
  const record = await Maintenance.findById(id)
    .populate('vehicle')
    .populate('createdBy', 'fullName email role');

  if (!record) {
    throw new Error('Maintenance record not found');
  }

  return record;
};

/**
 * Update a maintenance record.
 * @param {string} id - The maintenance ID.
 * @param {Object} data - Update data.
 * @returns {Promise<Object>} The updated maintenance document.
 */
export const updateMaintenance = async (id, data) => {
  const record = await Maintenance.findById(id);
  if (!record) {
    throw new Error('Maintenance record not found');
  }

  // Allowed fields to update
  const allowedUpdates = [
    'description',
    'cost',
    'technicianName',
    'remarks',
    'maintenanceDate',
    'completionDate',
    'maintenanceStatus',
  ];

  Object.keys(data).forEach(key => {
    if (allowedUpdates.includes(key)) {
      record[key] = data[key];
    }
  });

  return await record.save();
};

/**
 * Complete a maintenance record.
 * @param {string} id - The maintenance ID.
 * @param {Object} [data={}] - Optional completion data (completionDate, remarks, cost).
 * @returns {Promise<Object>} The completed maintenance document.
 */
export const completeMaintenance = async (id, data = {}) => {
  const record = await Maintenance.findById(id);
  if (!record) {
    throw new Error('Maintenance record not found');
  }

  record.maintenanceStatus = 'Completed';
  
  // Set completion details if provided, otherwise default completionDate to current date
  record.completionDate = data.completionDate ? new Date(data.completionDate) : new Date();
  
  if (data.remarks !== undefined) {
    record.remarks = data.remarks;
  }
  
  if (data.cost !== undefined) {
    record.cost = data.cost;
  }

  const savedRecord = await record.save();

  const vehicle = await Vehicle.findById(record.vehicle);
  if (vehicle && vehicle.status !== 'Retired') {
    vehicle.status = 'Available';
    await vehicle.save();
  }

  return savedRecord;
};

/**
 * Delete a maintenance record.
 * @param {string} id - The maintenance ID.
 * @returns {Promise<Object>} Successful delete message.
 */
export const deleteMaintenance = async (id) => {
  const record = await Maintenance.findById(id);
  if (!record) {
    throw new Error('Maintenance record not found');
  }

  // If deleted while Pending or In Progress, restore vehicle to Available
  if (record.maintenanceStatus === 'Pending' || record.maintenanceStatus === 'In Progress') {
    const vehicle = await Vehicle.findById(record.vehicle);
    if (vehicle && vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
      await vehicle.save();
    }
  }

  await record.deleteOne();
  return { message: 'Maintenance record deleted successfully' };
};

/**
 * Get maintenance records filtered by status.
 * @param {string} status - Maintenance status to filter by.
 * @returns {Promise<Array>} List of matching maintenance records.
 */
export const getMaintenanceByStatus = async (status) => {
  return await Maintenance.find({ maintenanceStatus: status })
    .populate('vehicle')
    .populate('createdBy', 'fullName email role');
};
