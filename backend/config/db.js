import mongoose from 'mongoose';

/**
 * Establish database connection to MongoDB
 * @returns {Promise<typeof mongoose>} Connection promise
 */
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transitops';

  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

export default connectDB;
