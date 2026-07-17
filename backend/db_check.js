import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transitops';

const tripSchema = new mongoose.Schema(
  {
    tripNumber: String,
  },
  { strict: false }
);

const Trip = mongoose.model('Trip', tripSchema);

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');
    const trips = await Trip.find({}, 'tripNumber');
    console.log('Trips in DB:', trips);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
};

run();
