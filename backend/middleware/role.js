/**
 * Restrict access to specific user roles
 * @param {...string} allowedRoles - Roles allowed to access the route
 * @returns {Function} Express middleware
 */
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const err = new Error('You do not have permission to perform this action');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};
