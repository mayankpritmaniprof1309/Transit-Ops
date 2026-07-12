import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
