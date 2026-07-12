import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    vehicleModel: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: {
        values: ['Truck', 'Van', 'Mini Truck', 'Pickup', 'Trailer', 'Other'],
        message: '{VALUE} is not a valid vehicle type',
      },
    },
    maximumLoadCapacity: {
      type: Number,
      required: [true, 'Maximum load capacity is required'],
      min: [0, 'Maximum load capacity cannot be negative'],
    },
    odometer: {
      type: Number,
      default: 0,
      min: [0, 'Odometer reading cannot be negative'],
    },
    acquisitionCost: {
      type: Number,
      required: [true, 'Acquisition cost is required'],
      min: [0, 'Acquisition cost cannot be negative'],
    },
    status: {
      type: String,
      default: 'Available',
      enum: {
        values: ['Available', 'On Trip', 'In Shop', 'Retired'],
        message: '{VALUE} is not a valid vehicle status',
      },
      index: true,
    },
    region: {
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

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
