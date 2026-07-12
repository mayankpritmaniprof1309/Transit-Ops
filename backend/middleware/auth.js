import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication protecting middleware
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const err = new Error('Not authorized to access this route');
      err.statusCode = 401;
      return next(err);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      const err = new Error('The user belonging to this token no longer exists');
      err.statusCode = 401;
      return next(err);
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    next(error);
  }
};
