const logger = require('../utils/logger');
const { formatErrorResponse } = require('../utils/responseFormatter');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../constants');

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    logger.warn('Validation error', messages);
    const response = formatErrorResponse(
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      messages
    );
    return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    logger.warn(`Duplicate key error on field: ${field}`);
    const response = formatErrorResponse(
      `${field} sudah terdaftar`,
      HTTP_STATUS.CONFLICT
    );
    return res.status(HTTP_STATUS.CONFLICT).json(response);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    logger.warn('Invalid ObjectId format');
    const response = formatErrorResponse(
      ERROR_MESSAGES.INVALID_TODO_ID,
      HTTP_STATUS.BAD_REQUEST
    );
    return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    logger.warn('JWT error');
    const response = formatErrorResponse(
      ERROR_MESSAGES.TOKEN_INVALID,
      HTTP_STATUS.UNAUTHORIZED
    );
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
  }

  if (err.name === 'TokenExpiredError') {
    logger.warn('Token expired');
    const response = formatErrorResponse(
      ERROR_MESSAGES.TOKEN_EXPIRED,
      HTTP_STATUS.UNAUTHORIZED
    );
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
  }

  // Default error response
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  const response = formatErrorResponse(message, statusCode);
  return res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const notFoundHandler = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  const response = formatErrorResponse(
    'Endpoint tidak ditemukan',
    HTTP_STATUS.NOT_FOUND
  );
  return res.status(HTTP_STATUS.NOT_FOUND).json(response);
};

module.exports = { errorHandler, notFoundHandler };