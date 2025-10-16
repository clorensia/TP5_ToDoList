const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { formatErrorResponse } = require('../utils/responseFormatter');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../constants');

/**
 * Verify JWT token middleware
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      logger.warn('No token provided');
      const response = formatErrorResponse(
        ERROR_MESSAGES.TOKEN_MISSING,
        HTTP_STATUS.UNAUTHORIZED
      );
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    logger.debug('Token verified successfully', { userId: decoded.userId });
    next();
  } catch (error) {
    logger.warn(`Token verification failed: ${error.message}`);

    let message = ERROR_MESSAGES.TOKEN_INVALID;
    if (error.name === 'TokenExpiredError') {
      message = ERROR_MESSAGES.TOKEN_EXPIRED;
    }

    const response = formatErrorResponse(
      message,
      HTTP_STATUS.UNAUTHORIZED
    );
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
  }
};

module.exports = { verifyToken };