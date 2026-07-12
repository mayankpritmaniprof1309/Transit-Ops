import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a given payload
 * @param {Object} payload - Data to be encoded in the token
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify a JWT token and decode its payload
 * @param {string} token - The token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If verification fails
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
