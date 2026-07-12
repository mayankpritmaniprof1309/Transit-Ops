import express from 'express';
import cors from 'cors';

// Import Routes
import driverRoutes from './routes/driver.routes.js';
import fuelRoutes from './routes/fuel.routes.js';

// Import Middleware
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Middleware
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/fuel-logs', fuelRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
