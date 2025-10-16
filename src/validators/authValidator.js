const { ERROR_MESSAGES } = require('../constants');

/**
 * Validate register input
 * @param {Object} data - Register data
 * @returns {Object} Validation result with errors array
 */
const validateRegister = (data) => {
  const errors = [];
  const { username, email, password, confirmPassword } = data;

  if (!username || username.trim() === '') {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'Username'));
  } else if (username.length < 3) {
    errors.push(ERROR_MESSAGES.USERNAME_TOO_SHORT);
  } else if (username.length > 30) {
    errors.push('Username tidak boleh lebih dari 30 karakter');
  }

  if (!email || email.trim() === '') {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'Email'));
  } else if (!isValidEmail(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (!password || password.trim() === '') {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'Password'));
  } else if (password.length < 6) {
    errors.push(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
  }

  if (!confirmPassword || confirmPassword.trim() === '') {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'Confirm Password'));
  }

  if (password && confirmPassword && password !== confirmPassword) {
    errors.push(ERROR_MESSAGES.PASSWORD_MISMATCH);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate login input
 * @param {Object} data - Login data
 * @returns {Object} Validation result with errors array
 */
const validateLogin = (data) => {
  const errors = [];
  const { email, password } = data;

  if (!email || email.trim() === '') {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'Email'));
  } else if (!isValidEmail(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (!password || password.trim() === '') {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD.replace('{field}', 'Password'));
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} Email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateRegister,
  validateLogin,
  isValidEmail
};