import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendMail } from '../utils/mailSender.js';

// Helper to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Create a new user
 * @param {Object} data 
 * @returns {Promise<Object>} Created user without password
 */
export const createUser = async (data) => {
  const { email, password } = data;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('Email is already registered');
    err.statusCode = 400;
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    ...data,
    password: hashedPassword,
  });

  const userObj = newUser.toObject();
  delete userObj.password;
  return userObj;
};

/**
 * Get all users with filters
 * @param {Object} filters 
 * @returns {Promise<Array>} List of users
 */
export const getAllUsers = async (filters = {}) => {
  return await User.find(filters).select('-password');
};

/**
 * Get a user by ID
 * @param {string} id 
 * @returns {Promise<Object>} User details
 */
export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * Update a user by ID
 * @param {string} id 
 * @param {Object} data 
 * @returns {Promise<Object>} Updated user details
 */
export const updateUser = async (id, data) => {
  const updateData = { ...data };

  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  if (updateData.email) {
    const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: id } });
    if (existingUser) {
      const err = new Error('Email is already in use by another user');
      err.statusCode = 400;
      throw err;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!updatedUser) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return updatedUser;
};

/**
 * Delete a user by ID
 * @param {string} id 
 * @returns {Promise<Object>} Deleted user details
 */
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * Login user and generate token
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User details and token
 */
export const loginUser = async (email, password) => {
  if (!email || !password) {
    const err = new Error('Please provide email and password');
    err.statusCode = 400;
    throw err;
  }

  // Find user and explicitly select password since we need to compare it
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

/**
 * Handle password reset token generation and emailing
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export const forgotPassword = async (email) => {
  if (!email) {
    const err = new Error('Please provide email address');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    // For security, do not reveal if email exists, just return true
    return true;
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour expiry
  await user.save({ validateBeforeSave: false });

  // Send email
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) have requested the reset of a password.
Please click on the following link, or paste this into your browser to complete the process within 1 hour:

${resetUrl}

If you did not request this, please ignore this email and your password will remain unchanged.`;

  const html = `<p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
<p>Please click on the link below to complete the process within 1 hour:</p>
<p><a href="${resetUrl}" style="padding: 10px 20px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
<p>Or copy and paste this URL into your browser:</p>
<pre>${resetUrl}</pre>
<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

  await sendMail({
    to: user.email,
    subject: 'TransitOps Password Reset Request',
    text: message,
    html,
  });

  return true;
};

/**
 * Reset password using token
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<boolean>}
 */
export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    const err = new Error('Please provide reset token and new password');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    const err = new Error('Password reset token is invalid or has expired');
    err.statusCode = 400;
    throw err;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  // Clear reset token fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save({ validateBeforeSave: false });

  return true;
};
