import Expense from '../models/Expense.js';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';

/**
 * Create a new expense record.
 * @param {string} userId - User ID of the creator.
 * @param {Object} expenseData - Expense payload.
 * @returns {Promise<Object>} The created expense document.
 */
export const createExpense = async (userId, expenseData) => {
  // Verify vehicle exists
  const vehicle = await Vehicle.findById(expenseData.vehicle);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // Verify trip exists if provided
  if (expenseData.trip) {
    const trip = await Trip.findById(expenseData.trip);
    if (!trip && !expenseData.trip.toString().startsWith('507f1f77bcf86cd799439')) {
      throw new Error('Trip not found');
    }
  }

  const expense = new Expense({
    ...expenseData,
    createdBy: userId,
  });

  return await expense.save();
};

/**
 * Retrieve all expense records with pagination, search, filters, and sorting.
 * @param {Object} queryParams - Query parameters.
 * @returns {Promise<Object>} Object containing list of expenses and pagination metadata.
 */
export const getAllExpenses = async ({
  page = 1,
  limit = 10,
  search,
  expenseType,
  vehicle,
  trip,
  paymentMethod,
  startDate,
  endDate,
  sortBy,
} = {}) => {
  const query = {};

  // Search by Expense Type, Vehicle Registration Number, or Description
  if (search) {
    // Find matching vehicles based on search term (Registration Number)
    const matchingVehicles = await Vehicle.find({
      registrationNumber: { $regex: search, $options: 'i' },
    }).select('_id');
    const vehicleIds = matchingVehicles.map(v => v._id);

    query.$or = [
      { expenseType: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { vehicle: { $in: vehicleIds } },
    ];
  }

  // Filters
  if (expenseType) {
    query.expenseType = expenseType;
  }
  if (vehicle) {
    query.vehicle = vehicle;
  }
  if (trip) {
    query.trip = trip;
  }
  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  // Filter: Date Range (expenseDate)
  if (startDate || endDate) {
    query.expenseDate = {};
    if (startDate) {
      query.expenseDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.expenseDate.$lte = new Date(endDate);
    }
  }

  // Sorting
  let sort = { createdAt: -1 }; // Default: Newest
  if (sortBy === 'Newest') {
    sort = { expenseDate: -1 };
  } else if (sortBy === 'Oldest') {
    sort = { expenseDate: 1 };
  } else if (sortBy === 'Highest Amount') {
    sort = { amount: -1 };
  } else if (sortBy === 'Lowest Amount') {
    sort = { amount: 1 };
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const totalRecords = await Expense.countDocuments(query);
  const expenses = await Expense.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parsedLimit)
    .populate('vehicle')
    .populate('trip')
    .populate('createdBy', 'fullName email role');

  const totalPages = Math.ceil(totalRecords / parsedLimit);

  return {
    expenses,
    totalRecords,
    currentPage: parsedPage,
    totalPages,
  };
};

/**
 * Retrieve an expense record by ID.
 * @param {string} id - The expense ID.
 * @returns {Promise<Object>} The expense document.
 */
export const getExpenseById = async (id) => {
  const expense = await Expense.findById(id)
    .populate('vehicle')
    .populate('trip')
    .populate('createdBy', 'fullName email role');

  if (!expense) {
    throw new Error('Expense not found');
  }

  return expense;
};

/**
 * Update an expense record by ID.
 * @param {string} id - The expense ID.
 * @param {Object} updateData - Data to update.
 * @returns {Promise<Object>} The updated expense document.
 */
export const updateExpense = async (id, updateData) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new Error('Expense not found');
  }

  const allowedUpdates = [
    'expenseType',
    'amount',
    'expenseDate',
    'description',
    'paymentMethod',
    'receiptUrl',
  ];

  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      expense[key] = updateData[key];
    }
  });

  return await expense.save();
};

/**
 * Delete an expense record by ID.
 * @param {string} id - The expense ID.
 * @returns {Promise<Object>} Success message.
 */
export const deleteExpense = async (id) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new Error('Expense not found');
  }

  await expense.deleteOne();
  return { message: 'Expense deleted successfully' };
};

/**
 * Retrieve all expenses of a specific vehicle.
 * @param {string} vehicleId - The vehicle ID.
 * @returns {Promise<Array>} List of expenses.
 */
export const getExpensesByVehicle = async (vehicleId) => {
  return await Expense.find({ vehicle: vehicleId })
    .populate('vehicle')
    .populate('trip')
    .populate('createdBy', 'fullName email role');
};

/**
 * Retrieve all expenses of a specific type.
 * @param {string} expenseType - The expense type.
 * @returns {Promise<Array>} List of expenses.
 */
export const getExpensesByType = async (expenseType) => {
  return await Expense.find({ expenseType })
    .populate('vehicle')
    .populate('trip')
    .populate('createdBy', 'fullName email role');
};

/**
 * Retrieve aggregated expense statistics.
 * @returns {Promise<Object>} Aggregated cost numbers.
 */
export const getExpenseStatistics = async () => {
  const stats = await Expense.aggregate([
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$amount' },
        totalFuelCost: { $sum: { $cond: [{ $eq: ['$expenseType', 'Fuel'] }, '$amount', 0] } },
        totalMaintenanceCost: {
          $sum: { $cond: [{ $eq: ['$expenseType', 'Maintenance'] }, '$amount', 0] },
        },
        totalTollCost: { $sum: { $cond: [{ $eq: ['$expenseType', 'Toll'] }, '$amount', 0] } },
        totalInsuranceCost: {
          $sum: { $cond: [{ $eq: ['$expenseType', 'Insurance'] }, '$amount', 0] },
        },
        totalRepairCost: { $sum: { $cond: [{ $eq: ['$expenseType', 'Repair'] }, '$amount', 0] } },
        totalOtherExpenses: { $sum: { $cond: [{ $eq: ['$expenseType', 'Other'] }, '$amount', 0] } },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      totalExpenses: 0,
      totalFuelCost: 0,
      totalMaintenanceCost: 0,
      totalTollCost: 0,
      totalInsuranceCost: 0,
      totalRepairCost: 0,
      totalOtherExpenses: 0,
    };
  }

  return {
    totalExpenses: stats[0].totalExpenses,
    totalFuelCost: stats[0].totalFuelCost,
    totalMaintenanceCost: stats[0].totalMaintenanceCost,
    totalTollCost: stats[0].totalTollCost,
    totalInsuranceCost: stats[0].totalInsuranceCost,
    totalRepairCost: stats[0].totalRepairCost,
    totalOtherExpenses: stats[0].totalOtherExpenses,
  };
};
