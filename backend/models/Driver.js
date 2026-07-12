import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    licenseCategory: {
      type: String,
      required: [true, 'License category is required'],
      trim: true,
    },
    licenseExpiryDate: {
      type: Date,
      required: [true, 'License expiry date is required'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    safetyScore: {
      type: Number,
      default: 100,
      min: [0, 'Safety score cannot be less than 0'],
      max: [100, 'Safety score cannot be more than 100'],
    },
    status: {
      type: String,
      default: 'Available',
      enum: {
        values: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
        message: '{VALUE} is not a valid driver status',
      },
      index: true,
    },
    address: {
      type: String,
      trim: true,
    },
    emergencyContact: {
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

const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);

export default Driver;
