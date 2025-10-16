const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS
} = require('../constants');

/**
 * Register new user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    const validation = validateRegister({ username, email, password, confirmPassword });
    if (!validation.isValid) {
      logger.warn('Register validation failed', validation.errors);
      const response = formatErrorResponse(
        ERROR_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
        validation.errors
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      logger.warn(`Register failed: User already exists`, { email, username });
      const response = formatErrorResponse(
        ERROR_MESSAGES.USER_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT
      );
      return res.status(HTTP_STATUS.CONFLICT).json(response);
    }

    // Create new user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password
    });

    await newUser.save();

    logger.info(`User registered successfully`, { userId: newUser._id, username });

    const response = formatSuccessResponse(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      },
      SUCCESS_MESSAGES.REGISTER_SUCCESS,
      HTTP_STATUS.CREATED
    );

    return res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

/**
 * Login user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      logger.warn('Login validation failed', validation.errors);
      const response = formatErrorResponse(
        ERROR_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
        validation.errors
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    }

    // Find user and select password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      logger.warn(`Login failed: User not found`, { email });
      const response = formatErrorResponse(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password`, { email });
      const response = formatErrorResponse(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`User logged in successfully`, { userId: user._id });

    const response = formatSuccessResponse(
      {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      SUCCESS_MESSAGES.LOGIN_SUCCESS,
      HTTP_STATUS.OK
    );

    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

module.exports = {
  register,
  login
};