const Todo = require('../models/Todo');
const logger = require('../utils/logger');
const { formatSuccessResponse, formatErrorResponse, formatPaginatedResponse } = require('../utils/responseFormatter');
const { validateCreateTodo, validateUpdateTodo } = require('../validators/todoValidator');
const { TODO_STATUS, TODO_PRIORITY, ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS } = require('../constants');

/**
 * Create new todo
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user.userId;

    // Validate input
    const validation = validateCreateTodo({ title, description, priority, dueDate });
    if (!validation.isValid) {
      logger.warn('Create todo validation failed', validation.errors);
      const response = formatErrorResponse(
        ERROR_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
        validation.errors
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    }

    // Create new todo
    const newTodo = new Todo({
      title,
      description: description || '',
      priority: priority || TODO_PRIORITY.MEDIUM,
      dueDate: dueDate || null,
      status: TODO_STATUS.PENDING,
      createdBy: userId
    });

    await newTodo.save();

    logger.info(`Todo created successfully`, { todoId: newTodo._id, userId });

    const response = formatSuccessResponse(
      newTodo,
      SUCCESS_MESSAGES.TODO_CREATED,
      HTTP_STATUS.CREATED
    );

    return res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    logger.error(`Create todo error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

/**
 * Get all todos for user with filtering and sorting
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, priority, sortBy, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { createdBy: userId };

    if (status && Object.values(TODO_STATUS).includes(status)) {
      query.status = status;
    }

    if (priority && Object.values(TODO_PRIORITY).includes(priority)) {
      query.priority = priority;
    }

    // Build sort
    let sort = { createdAt: -1 };
    if (sortBy === 'priority') {
      sort = { priority: -1 };
    } else if (sortBy === 'dueDate') {
      sort = { dueDate: 1 };
    } else if (sortBy === 'status') {
      sort = { status: 1 };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const todos = await Todo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Todo.countDocuments(query);

    logger.info(`Todos retrieved successfully`, { userId, count: todos.length });

    const response = formatPaginatedResponse(
      todos,
      total,
      pageNum,
      limitNum,
      SUCCESS_MESSAGES.TODOS_RETRIEVED
    );

    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    logger.error(`Get todos error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

/**
 * Get single todo detail
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getTodoDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const response = formatErrorResponse(
        ERROR_MESSAGES.INVALID_TODO_ID,
        HTTP_STATUS.BAD_REQUEST
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    }

    // Find todo
    const todo = await Todo.findOne({ _id: id, createdBy: userId });

    if (!todo) {
      logger.warn(`Todo not found`, { todoId: id, userId });
      const response = formatErrorResponse(
        ERROR_MESSAGES.TODO_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
      return res.status(HTTP_STATUS.NOT_FOUND).json(response);
    }

    const response = formatSuccessResponse(
      todo,
      SUCCESS_MESSAGES.TODO_DETAIL_RETRIEVED,
      HTTP_STATUS.OK
    );

    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    logger.error(`Get todo detail error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

/**
 * Update todo
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, description, status, priority, dueDate } = req.body;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const response = formatErrorResponse(
        ERROR_MESSAGES.INVALID_TODO_ID,
        HTTP_STATUS.BAD_REQUEST
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    }

    // Validate input
    const validation = validateUpdateTodo({ title, description, status, priority, dueDate });
    if (!validation.isValid) {
      logger.warn('Update todo validation failed', validation.errors);
      const response = formatErrorResponse(
        ERROR_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
        validation.errors
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    }

    // Find todo
    const todo = await Todo.findOne({ _id: id, createdBy: userId });

    if (!todo) {
      logger.warn(`Todo not found for update`, { todoId: id, userId });
      const response = formatErrorResponse(
        ERROR_MESSAGES.TODO_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
      return res.status(HTTP_STATUS.NOT_FOUND).json(response);
    }

    // Update fields
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (status !== undefined) todo.status = status;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();

    logger.info(`Todo updated successfully`, { todoId: id, userId });

    const response = formatSuccessResponse(
      todo,
      SUCCESS_MESSAGES.TODO_UPDATED,
      HTTP_STATUS.OK
    );

    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    logger.error(`Update todo error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

/**
 * Delete single todo
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const response = formatErrorResponse(
        ERROR_MESSAGES.INVALID_TODO_ID,
        HTTP_STATUS.BAD_REQUEST
      );
      return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    }

    // Find and delete todo
    const todo = await Todo.findOneAndDelete({ _id: id, createdBy: userId });

    if (!todo) {
      logger.warn(`Todo not found for delete`, { todoId: id, userId });
      const response = formatErrorResponse(
        ERROR_MESSAGES.TODO_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
      return res.status(HTTP_STATUS.NOT_FOUND).json(response);
    }

    logger.info(`Todo deleted successfully`, { todoId: id, userId });

    const response = formatSuccessResponse(
      null,
      SUCCESS_MESSAGES.TODO_DELETED,
      HTTP_STATUS.OK
    );

    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    logger.error(`Delete todo error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

/**
 * Delete all todos for user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteAllTodos = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete all todos
    const result = await Todo.deleteMany({ createdBy: userId });

    logger.info(`All todos deleted successfully`, { userId, deletedCount: result.deletedCount });

    const response = formatSuccessResponse(
      { deletedCount: result.deletedCount },
      SUCCESS_MESSAGES.ALL_TODOS_DELETED,
      HTTP_STATUS.OK
    );

    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    logger.error(`Delete all todos error: ${error.message}`);
    const response = formatErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoDetail,
  updateTodo,
  deleteTodo,
  deleteAllTodos
};