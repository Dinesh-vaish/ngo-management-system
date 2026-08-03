'use strict';

/**
 * Centralized error handler middleware
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message    = 'Duplicate entry. This record already exists.';
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message    = 'Referenced record not found.';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${err.stack}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
