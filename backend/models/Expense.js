import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      index: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      index: true,
    },
    expenseType: {
      type: String,
      required: [true, 'Expense type is required'],
      enum: {
        values: ['Fuel', 'Maintenance', 'Toll', 'Insurance', 'Repair', 'Other'],
        message: '{VALUE} is not a valid expense type',
      },
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    expenseDate: {
      type: Date,
      required: [true, 'Expense date is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['Cash', 'Card', 'UPI', 'Bank Transfer'],
        message: '{VALUE} is not a valid payment method',
      },
    },
    receiptUrl: {
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

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export default Expense;
