import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';

// Import Routes
import driverRoutes from './routes/driver.routes.js';
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import tripRoutes from './routes/trip.routes.js';
import fuelRoutes from './routes/fuel.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import reportRoutes from './routes/report.routes.js';

// Import Middleware
import { requestLogger } from './middleware/logger.js';

const app = express();

// Middleware
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/users', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/fuel-logs', fuelRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`,
  });
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
