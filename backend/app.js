import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';

// Import Routes
import driverRoutes from './routes/driver.routes.js';
import userRoutes from './routes/user.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import tripRoutes from './routes/trip.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

// Fallback Route for Undefined Endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
