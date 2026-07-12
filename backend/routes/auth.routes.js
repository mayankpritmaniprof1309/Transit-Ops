import express from 'express';
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = express.Router();

// Public routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);

// Mutation routes - Fleet Manager only
router.put('/:id', protect, restrictTo('Fleet Manager'), updateUser);
router.delete('/:id', protect, restrictTo('Fleet Manager'), deleteUser);

export default router;
