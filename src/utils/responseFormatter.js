const { RESPONSE_STATUS, HTTP_STATUS } = require('../constants');

/**
 * Format success response
 * @param {Object} data - Response data
 * @param {String} message - Response message
 * @param {Number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
const formatSuccessResponse = (data, message, statusCode = HTTP_STATUS.OK) => {
  return {
    status: RESPONSE_STATUS.SUCCESS,
    statusCode,
    message,
    data
  };
};

/**
 * Format error response
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {Array|Object} details - Additional error details
 * @returns {Object} Formatted response
 */
const formatErrorResponse = (message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => {
  const response = {
    status: RESPONSE_STATUS.ERROR,
    statusCode,
    message
  };

  if (details) {
    response.details = details;
  }

  return response;
};

/**
 * Format paginated response
 * @param {Array} data - Response data array
 * @param {Number} total - Total items
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {String} message - Response message
 * @returns {Object} Formatted response
 */
const formatPaginatedResponse = (data, total, page, limit, message) => {
  return {
    status: RESPONSE_STATUS.SUCCESS,
    statusCode: HTTP_STATUS.OK,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  formatSuccessResponse,
  formatErrorResponse,
  formatPaginatedResponse
};

