const { TODO_STATUS, TODO_PRIORITY, ERROR_MESSAGES } = require('../constants');

/**
 * Validate create todo input
 * @param {Object} data - Todo data
 * @returns {Object} Validation result with errors array
 */
const validateCreateTodo = (data) => {
  const errors = [];
  const { title, description, priority, dueDate } = data;

  if (!title || title.trim() === '') {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'Title'));
  } else if (title.length > 200) {
    errors.push('Title tidak boleh lebih dari 200 karakter');
  }

  if (description && description.length > 1000) {
    errors.push('Description tidak boleh lebih dari 1000 karakter');
  }

  if (priority && !isValidPriority(priority)) {
    errors.push(ERROR_MESSAGES.INVALID_PRIORITY);
  }

  if (dueDate && !isValidDueDate(dueDate)) {
    errors.push(ERROR_MESSAGES.DUE_DATE_PAST);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate update todo input
 * @param {Object} data - Todo data to update
 * @returns {Object} Validation result with errors array
 */
const validateUpdateTodo = (data) => {
  const errors = [];
  const { title, description, status, priority, dueDate } = data;

  if (title !== undefined && title.trim() === '') {
    errors.push('Title tidak boleh kosong');
  } else if (title && title.length > 200) {
    errors.push('Title tidak boleh lebih dari 200 karakter');
  }

  if (description !== undefined && description.length > 1000) {
    errors.push('Description tidak boleh lebih dari 1000 karakter');
  }

  if (status && !isValidStatus(status)) {
    errors.push(ERROR_MESSAGES.INVALID_STATUS);
  }

  if (priority && !isValidPriority(priority)) {
    errors.push(ERROR_MESSAGES.INVALID_PRIORITY);
  }

  if (dueDate && !isValidDueDate(dueDate)) {
    errors.push(ERROR_MESSAGES.DUE_DATE_PAST);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate todo status
 * @param {String} status - Status to validate
 * @returns {Boolean} Status is valid
 */
const isValidStatus = (status) => {
  return Object.values(TODO_STATUS).includes(status);
};

/**
 * Validate todo priority
 * @param {String} priority - Priority to validate
 * @returns {Boolean} Priority is valid
 */
const isValidPriority = (priority) => {
  return Object.values(TODO_PRIORITY).includes(priority);
};

/**
 * Validate due date
 * @param {String} dueDate - Date to validate
 * @returns {Boolean} Date is valid and not in the past
 */
const isValidDueDate = (dueDate) => {
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  isValidStatus,
  isValidPriority,
  isValidDueDate
};