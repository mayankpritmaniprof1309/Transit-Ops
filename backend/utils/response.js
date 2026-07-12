/**
 * Send a standardized success response
 * @param {Object} res - Express response object
 * @param {any} data - Response payload data
 * @param {string} message - Success message
 * @param {number} [statusCode=200] - HTTP status code
 */
export const sendSuccess = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a standardized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {any} [errors=null] - Additional validation or error details
 */
export const sendError = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
