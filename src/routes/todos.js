const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  createTodo,
  getTodos,
  getTodoDetail,
  updateTodo,
  deleteTodo,
  deleteAllTodos
} = require('../controllers/todoController');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

/**
 * POST /api/todos
 * Create new todo
 */
router.post('/', createTodo);

/**
 * GET /api/todos
 * Get all todos for authenticated user
 * Query parameters: status, priority, sortBy, page, limit
 */
router.get('/', getTodos);

/**
 * GET /api/todos/:id
 * Get single todo detail
 */
router.get('/:id', getTodoDetail);

/**
 * PUT /api/todos/:id
 * Update todo
 */
router.put('/:id', updateTodo);

/**
 * DELETE /api/todos/:id
 * Delete single todo
 */
router.delete('/:id', deleteTodo);

/**
 * DELETE /api/todos
 * Delete all todos for user
 */
router.delete('/', deleteAllTodos);

module.exports = router;