// ============================================
// Fix It — Global Error Handler Middleware
// ============================================
import logger from '../utils/logger.js';
import { errorResponse } from '../utils/response.js';

/**
 * Global error handler — catches all unhandled errors
 */
export const errorHandler = (err, req, res, _next) => {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return errorResponse(res, 'Validation failed', 422, errors);
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path || 'field';
    return errorResponse(res, `${field} already exists`, 409);
  }

  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse(res, 'Referenced resource not found', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File too large — max 10MB', 413);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return errorResponse(res, 'Too many files — max 5 per upload', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return errorResponse(res, 'Unexpected file field', 400);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export default { errorHandler, notFoundHandler };
