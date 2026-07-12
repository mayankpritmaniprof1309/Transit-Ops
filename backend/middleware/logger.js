/**
 * Request logger middleware
 * Logs method, URL, status code, and response time
 */
export const requestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    console.log(`[${req.method}] ${req.originalUrl || req.url} - ${res.statusCode} (${responseTime}ms)`);
  });

  next();
};
