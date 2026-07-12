/**
 * Express asyncHandler utility to wrap asynchronous route handlers and forward errors
 * @param {Function} fn - Asynchronous route handler
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
