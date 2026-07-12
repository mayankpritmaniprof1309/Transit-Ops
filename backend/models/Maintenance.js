import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index: true,
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    maintenanceDate: {
      type: Date,
      required: [true, 'Maintenance date is required'],
    },
    completionDate: {
      type: Date,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    maintenanceStatus: {
      type: String,
      default: 'Pending',
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid maintenance status',
      },
      index: true,
    },
    technicianName: {
      type: String,
      trim: true,
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

const Maintenance = mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
