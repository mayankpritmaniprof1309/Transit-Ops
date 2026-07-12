import express from 'express';
import * as DashboardController from '../controllers/dashboard.controllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', DashboardController.getDashboardData);

export default router;
