import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';

/**
 * Reusable helper method to convert headers and rows into CSV string format.
 */
const convertToCsv = (headers, rows) => {
  const escapeField = (val) => {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) return val.toISOString();
    const str = String(val).replace(/"/g, '""');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str}"`;
    }
    return str;
  };

  const csvRows = [headers.join(',')];
  for (const row of rows) {
    csvRows.push(row.map(escapeField).join(','));
  }
  return csvRows.join('\n');
};

/**
 * Generates summary statistics and Fleet Utilization % for the dashboard.
 */
export const getDashboardReport = async (startDate, endDate) => {
  // Current counts of vehicles and drivers (these represent status in real-time)
  const totalVehicles = await Vehicle.countDocuments();
  const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
  const vehiclesOnTrip = await Vehicle.countDocuments({ status: 'On Trip' });
  const vehiclesInShop = await Vehicle.countDocuments({ status: 'In Shop' });
  const retiredVehicles = await Vehicle.countDocuments({ status: 'Retired' });

  const totalDrivers = await Driver.countDocuments();
  const driversAvailable = await Driver.countDocuments({ status: 'Available' });
  const driversOnTrip = await Driver.countDocuments({ status: 'On Trip' });
  const suspendedDrivers = await Driver.countDocuments({ status: 'Suspended' });

  // Trip counts can be filtered by optional date range
  const tripFilter = {};
  if (startDate || endDate) {
    tripFilter.createdAt = {};
    if (startDate) tripFilter.createdAt.$gte = new Date(startDate);
    if (endDate) tripFilter.createdAt.$lte = new Date(endDate);
  }

  const activeTrips = await Trip.countDocuments({ ...tripFilter, tripStatus: 'Dispatched' });
  const completedTrips = await Trip.countDocuments({ ...tripFilter, tripStatus: 'Completed' });
  const cancelledTrips = await Trip.countDocuments({ ...tripFilter, tripStatus: 'Cancelled' });
  const pendingTrips = await Trip.countDocuments({ ...tripFilter, tripStatus: 'Draft' });

  const fleetUtilization = totalVehicles > 0 ? ((vehiclesOnTrip / totalVehicles) * 100) : 0;

  return {
    totalVehicles,
    availableVehicles,
    vehiclesOnTrip,
    vehiclesInShop,
    retiredVehicles,
    totalDrivers,
    driversAvailable,
    driversOnTrip,
    suspendedDrivers,
    activeTrips,
    completedTrips,
    cancelledTrips,
    pendingTrips,
    fleetUtilization: parseFloat(fleetUtilization.toFixed(2)),
  };
};

/**
 * Calculates Fuel Efficiency (Distance / Fuel Consumed) for completed trips.
 */
export const getFuelEfficiencyReport = async (startDate, endDate, vehicleId) => {
  const filter = { tripStatus: 'Completed' };
  if (vehicleId) {
    filter.vehicle = new mongoose.Types.ObjectId(vehicleId);
  }
  if (startDate || endDate) {
    filter.completionDate = {};
    if (startDate) filter.completionDate.$gte = new Date(startDate);
    if (endDate) filter.completionDate.$lte = new Date(endDate);
  }

  const trips = await Trip.find(filter)
    .populate('vehicle', 'registrationNumber vehicleName vehicleModel')
    .populate('driver', 'fullName licenseNumber');

  return trips.map((trip) => {
    const distance = trip.actualDistance || 0;
    const fuel = trip.fuelConsumed || 0;
    const efficiency = fuel > 0 ? (distance / fuel) : 0;
    return {
      tripNumber: trip.tripNumber,
      vehicle: trip.vehicle,
      driver: trip.driver,
      distance,
      fuelConsumed: fuel,
      fuelEfficiency: parseFloat(efficiency.toFixed(2)),
    };
  });
};

/**
 * Aggregates operational costs (Fuel, Maintenance, and other expenses) per vehicle.
 */
export const getOperationalCostReport = async (startDate, endDate, vehicleId) => {
  const matchVehicle = {};
  if (vehicleId) {
    matchVehicle._id = new mongoose.Types.ObjectId(vehicleId);
  }

  const pipeline = [
    { $match: matchVehicle },
    // Lookup Fuel Logs
    {
      $lookup: {
        from: 'fuellogs',
        let: { vehicleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$vehicle', '$$vehicleId'] },
              ...(startDate || endDate ? {
                fuelDate: {
                  ...(startDate ? { $gte: new Date(startDate) } : {}),
                  ...(endDate ? { $lte: new Date(endDate) } : {})
                }
              } : {})
            }
          },
          {
            $group: {
              _id: null,
              totalFuelCost: { $sum: '$fuelCost' }
            }
          }
        ],
        as: 'fuelData'
      }
    },
    // Lookup Maintenance Cost
    {
      $lookup: {
        from: 'maintenances',
        let: { vehicleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$vehicle', '$$vehicleId'] },
              maintenanceStatus: 'Completed',
              ...(startDate || endDate ? {
                maintenanceDate: {
                  ...(startDate ? { $gte: new Date(startDate) } : {}),
                  ...(endDate ? { $lte: new Date(endDate) } : {})
                }
              } : {})
            }
          },
          {
            $group: {
              _id: null,
              totalMaintenanceCost: { $sum: '$cost' }
            }
          }
        ],
        as: 'maintenanceData'
      }
    },
    // Lookup Other Expenses (excluding type Fuel and Maintenance to avoid double-counting)
    {
      $lookup: {
        from: 'expenses',
        let: { vehicleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$vehicle', '$$vehicleId'] },
              expenseType: { $nin: ['Fuel', 'Maintenance'] },
              ...(startDate || endDate ? {
                expenseDate: {
                  ...(startDate ? { $gte: new Date(startDate) } : {}),
                  ...(endDate ? { $lte: new Date(endDate) } : {})
                }
              } : {})
            }
          },
          {
            $group: {
              _id: null,
              totalOtherExpenses: { $sum: '$amount' }
            }
          }
        ],
        as: 'expenseData'
      }
    },
    // Projection & Summation
    {
      $project: {
        _id: 1,
        registrationNumber: 1,
        vehicleName: 1,
        vehicleModel: 1,
        fuelCost: { $ifNull: [{ $arrayElemAt: ['$fuelData.totalFuelCost', 0] }, 0] },
        maintenanceCost: { $ifNull: [{ $arrayElemAt: ['$maintenanceData.totalMaintenanceCost', 0] }, 0] },
        otherExpenses: { $ifNull: [{ $arrayElemAt: ['$expenseData.totalOtherExpenses', 0] }, 0] }
      }
    },
    {
      $addFields: {
        totalOperationalCost: {
          $add: ['$fuelCost', '$maintenanceCost', '$otherExpenses']
        }
      }
    }
  ];

  return await Vehicle.aggregate(pipeline);
};

/**
 * Calculates Return on Investment (ROI) per vehicle.
 * ROI = (Revenue - (Fuel + Maintenance + Expenses)) / Acquisition Cost
 */
export const getVehicleROIReport = async (startDate, endDate, vehicleId) => {
  const matchVehicle = {};
  if (vehicleId) {
    matchVehicle._id = new mongoose.Types.ObjectId(vehicleId);
  }

  const pipeline = [
    { $match: matchVehicle },
    // Lookup Completed Trip Revenue
    {
      $lookup: {
        from: 'trips',
        let: { vehicleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$vehicle', '$$vehicleId'] },
              tripStatus: 'Completed',
              ...(startDate || endDate ? {
                completionDate: {
                  ...(startDate ? { $gte: new Date(startDate) } : {}),
                  ...(endDate ? { $lte: new Date(endDate) } : {})
                }
              } : {})
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$expectedRevenue' }
            }
          }
        ],
        as: 'tripData'
      }
    },
    // Lookup Fuel cost
    {
      $lookup: {
        from: 'fuellogs',
        let: { vehicleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$vehicle', '$$vehicleId'] },
              ...(startDate || endDate ? {
                fuelDate: {
                  ...(startDate ? { $gte: new Date(startDate) } : {}),
                  ...(endDate ? { $lte: new Date(endDate) } : {})
                }
              } : {})
            }
          },
          {
            $group: {
              _id: null,
              totalFuelCost: { $sum: '$fuelCost' }
            }
          }
        ],
        as: 'fuelData'
      }
    },
    // Lookup Maintenance cost
    {
      $lookup: {
        from: 'maintenances',
        let: { vehicleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$vehicle', '$$vehicleId'] },
              maintenanceStatus: 'Completed',
              ...(startDate || endDate ? {
                maintenanceDate: {
                  ...(startDate ? { $gte: new Date(startDate) } : {}),
                  ...(endDate ? { $lte: new Date(endDate) } : {})
                }
              } : {})
            }
          },
          {
            $group: {
              _id: null,
              totalMaintenanceCost: { $sum: '$cost' }
            }
          }
        ],
        as: 'maintenanceData'
      }
    },
    // Lookup Other Expenses
    {
      $lookup: {
        from: 'expenses',
        let: { vehicleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$vehicle', '$$vehicleId'] },
              expenseType: { $nin: ['Fuel', 'Maintenance'] },
              ...(startDate || endDate ? {
                expenseDate: {
                  ...(startDate ? { $gte: new Date(startDate) } : {}),
                  ...(endDate ? { $lte: new Date(endDate) } : {})
                }
              } : {})
            }
          },
          {
            $group: {
              _id: null,
              totalExpenses: { $sum: '$amount' }
            }
          }
        ],
        as: 'expenseData'
      }
    },
    // Project and Perform ROI Calculation
    {
      $project: {
        _id: 1,
        registrationNumber: 1,
        vehicleName: 1,
        vehicleModel: 1,
        acquisitionCost: { $ifNull: ['$acquisitionCost', 0] },
        revenue: { $ifNull: [{ $arrayElemAt: ['$tripData.totalRevenue', 0] }, 0] },
        fuelCost: { $ifNull: [{ $arrayElemAt: ['$fuelData.totalFuelCost', 0] }, 0] },
        maintenanceCost: { $ifNull: [{ $arrayElemAt: ['$maintenanceData.totalMaintenanceCost', 0] }, 0] },
        expenses: { $ifNull: [{ $arrayElemAt: ['$expenseData.totalExpenses', 0] }, 0] }
      }
    },
    {
      $addFields: {
        roi: {
          $cond: {
            if: { $gt: ['$acquisitionCost', 0] },
            then: {
              $divide: [
                { $subtract: ['$revenue', { $add: ['$fuelCost', '$maintenanceCost', '$expenses'] }] },
                '$acquisitionCost'
              ]
            },
            else: 0
          }
        }
      }
    }
  ];

  const results = await Vehicle.aggregate(pipeline);
  return results.map(r => ({
    ...r,
    roi: parseFloat(r.roi.toFixed(4)) // Round to 4 decimal places for exact ROI representation
  }));
};

/**
 * Generates detailed information, history, and status for a single vehicle.
 */
export const getVehicleWiseReport = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  const trips = await Trip.find({ vehicle: vehicleId })
    .populate('driver', 'fullName licenseNumber')
    .sort({ createdAt: -1 });

  const maintenanceHistory = await Maintenance.find({ vehicle: vehicleId })
    .sort({ maintenanceDate: -1 });

  const fuelLogs = await FuelLog.find({ vehicle: vehicleId })
    .sort({ fuelDate: -1 });

  const expenses = await Expense.find({ vehicle: vehicleId })
    .sort({ expenseDate: -1 });

  return {
    vehicleInformation: vehicle,
    trips,
    maintenanceHistory,
    fuelLogs,
    expenses,
    currentStatus: vehicle.status,
  };
};

/**
 * Retrieval of trips supporting filtering, pagination, sorting, and search.
 */
export const getTripReport = async (queryParams) => {
  const {
    startDate,
    endDate,
    vehicleId,
    driverId,
    tripStatus,
    search,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = queryParams;

  const filter = {};

  if (tripStatus) filter.tripStatus = tripStatus;
  if (vehicleId) filter.vehicle = new mongoose.Types.ObjectId(vehicleId);
  if (driverId) filter.driver = new mongoose.Types.ObjectId(driverId);

  if (search) {
    filter.$or = [
      { tripNumber: { $regex: search, $options: 'i' } },
      { source: { $regex: search, $options: 'i' } },
      { destination: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const trips = await Trip.find(filter)
    .populate('vehicle', 'registrationNumber vehicleName')
    .populate('driver', 'fullName licenseNumber')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Trip.countDocuments(filter);

  return {
    trips,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};

/**
 * Exports targeted entities to a CSV string.
 */
export const exportCsv = async (type, queryParams) => {
  const { startDate, endDate, vehicleId, driverId, tripStatus } = queryParams;
  const filter = {};

  if (startDate || endDate) {
    const dateField = type === 'expenses' ? 'expenseDate' : type === 'fuel_logs' ? 'fuelDate' : 'createdAt';
    filter[dateField] = {};
    if (startDate) filter[dateField].$gte = new Date(startDate);
    if (endDate) filter[dateField].$lte = new Date(endDate);
  }

  if (vehicleId && ['trips', 'expenses', 'fuel_logs'].includes(type)) {
    filter.vehicle = new mongoose.Types.ObjectId(vehicleId);
  }
  if (driverId && type === 'trips') {
    filter.driver = new mongoose.Types.ObjectId(driverId);
  }
  if (tripStatus && type === 'trips') {
    filter.tripStatus = tripStatus;
  }

  switch (type) {
    case 'trips': {
      const trips = await Trip.find(filter)
        .populate('vehicle', 'registrationNumber')
        .populate('driver', 'fullName')
        .populate('createdBy', 'fullName');

      const headers = [
        'Trip Number',
        'Source',
        'Destination',
        'Vehicle',
        'Driver',
        'Cargo Weight',
        'Planned Distance',
        'Actual Distance',
        'Expected Revenue',
        'Fuel Consumed',
        'Start Odometer',
        'End Odometer',
        'Status',
        'Created By',
        'Created At',
      ];

      const rows = trips.map(t => [
        t.tripNumber,
        t.source,
        t.destination,
        t.vehicle ? t.vehicle.registrationNumber : '',
        t.driver ? t.driver.fullName : '',
        t.cargoWeight,
        t.plannedDistance,
        t.actualDistance || 0,
        t.expectedRevenue || 0,
        t.fuelConsumed || 0,
        t.startOdometer || 0,
        t.endOdometer || 0,
        t.tripStatus,
        t.createdBy ? t.createdBy.fullName : '',
        t.createdAt,
      ]);

      return {
        filename: `trips_report_${Date.now()}.csv`,
        csvData: convertToCsv(headers, rows),
      };
    }

    case 'vehicles': {
      const vehicles = await Vehicle.find(filter);
      const headers = [
        'Registration Number',
        'Vehicle Name',
        'Vehicle Model',
        'Vehicle Type',
        'Max Load Capacity',
        'Odometer',
        'Status',
        'Acquisition Cost',
        'Region',
      ];

      const rows = vehicles.map(v => [
        v.registrationNumber,
        v.vehicleName,
        v.vehicleModel,
        v.vehicleType,
        v.maximumLoadCapacity,
        v.odometer || 0,
        v.status,
        v.acquisitionCost,
        v.region || '',
      ]);

      return {
        filename: `vehicles_report_${Date.now()}.csv`,
        csvData: convertToCsv(headers, rows),
      };
    }

    case 'drivers': {
      const drivers = await Driver.find(filter);
      const headers = [
        'Full Name',
        'License Number',
        'License Category',
        'License Expiry',
        'Contact Number',
        'Email',
        'Safety Score',
        'Status',
      ];

      const rows = drivers.map(d => [
        d.fullName,
        d.licenseNumber,
        d.licenseCategory,
        d.licenseExpiryDate,
        d.contactNumber,
        d.email || '',
        d.safetyScore || 100,
        d.status,
      ]);

      return {
        filename: `drivers_report_${Date.now()}.csv`,
        csvData: convertToCsv(headers, rows),
      };
    }

    case 'expenses': {
      const expenses = await Expense.find(filter)
        .populate('vehicle', 'registrationNumber')
        .populate('trip', 'tripNumber');

      const headers = [
        'Vehicle Registration',
        'Trip Number',
        'Expense Type',
        'Amount',
        'Expense Date',
        'Description',
        'Payment Method',
      ];

      const rows = expenses.map(e => [
        e.vehicle ? e.vehicle.registrationNumber : '',
        e.trip ? e.trip.tripNumber : '',
        e.expenseType,
        e.amount,
        e.expenseDate,
        e.description || '',
        e.paymentMethod,
      ]);

      return {
        filename: `expenses_report_${Date.now()}.csv`,
        csvData: convertToCsv(headers, rows),
      };
    }

    case 'fuel_logs': {
      const logs = await FuelLog.find(filter)
        .populate('vehicle', 'registrationNumber')
        .populate('trip', 'tripNumber');

      const headers = [
        'Vehicle Registration',
        'Trip Number',
        'Fuel Quantity',
        'Fuel Cost',
        'Fuel Station',
        'Fuel Date',
        'Odometer Reading',
      ];

      const rows = logs.map(l => [
        l.vehicle ? l.vehicle.registrationNumber : '',
        l.trip ? l.trip.tripNumber : '',
        l.fuelQuantity,
        l.fuelCost,
        l.fuelStation || '',
        l.fuelDate,
        l.odometerReading,
      ]);

      return {
        filename: `fuel_logs_report_${Date.now()}.csv`,
        csvData: convertToCsv(headers, rows),
      };
    }

    default:
      throw new Error('Invalid CSV export type');
  }
};
