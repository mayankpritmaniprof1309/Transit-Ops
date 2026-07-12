import express from 'express';
import cors from 'cors';

// Import Routes
import driverRoutes from './routes/driver.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/drivers', driverRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

export default app;
