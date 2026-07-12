import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      required: [true, 'Trip number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Source location is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination location is required'],
      trim: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver reference is required'],
      index: true,
    },
    cargoWeight: {
      type: Number,
      required: [true, 'Cargo weight is required'],
      min: [0, 'Cargo weight cannot be negative'],
    },
    plannedDistance: {
      type: Number,
      required: [true, 'Planned distance is required'],
      min: [0, 'Planned distance cannot be negative'],
    },
    actualDistance: {
      type: Number,
      min: [0, 'Actual distance cannot be negative'],
    },
    expectedRevenue: {
      type: Number,
      min: [0, 'Expected revenue cannot be negative'],
    },
    fuelConsumed: {
      type: Number,
      min: [0, 'Fuel consumed cannot be negative'],
    },
    startOdometer: {
      type: Number,
      min: [0, 'Start odometer reading cannot be negative'],
    },
    endOdometer: {
      type: Number,
      min: [0, 'End odometer reading cannot be negative'],
    },
    dispatchDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
    tripStatus: {
      type: String,
      default: 'Draft',
      enum: {
        values: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid trip status',
      },
      index: true,
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

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

export default Trip;
