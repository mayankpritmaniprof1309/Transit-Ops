import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      index: true,
    },
    fuelQuantity: {
      type: Number,
      required: [true, 'Fuel quantity is required'],
      min: [0, 'Fuel quantity cannot be negative'],
    },
    fuelCost: {
      type: Number,
      required: [true, 'Fuel cost is required'],
      min: [0, 'Fuel cost cannot be negative'],
    },
    fuelStation: {
      type: String,
      trim: true,
    },
    fuelDate: {
      type: Date,
      required: [true, 'Fuel date is required'],
    },
    odometerReading: {
      type: Number,
      required: [true, 'Odometer reading is required'],
      min: [0, 'Odometer reading cannot be negative'],
    },
    remarks: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

const FuelLog = mongoose.models.FuelLog || mongoose.model('FuelLog', fuelLogSchema);

export default FuelLog;
