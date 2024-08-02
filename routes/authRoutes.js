const express = require('express');
const { registerUser, authUser, getSessions } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { createTodo, getTodos, updateTodo, deleteTodo,toggleTodo } = require('../controllers/todoController');

const router = express.Router();

// User authentication routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Session management route (requires authentication)
router.get('/sessions', protect, getSessions);

// Todo routes
router.route('/todos')
  .post(protect, createTodo)   // Create a new todo
  .get(protect, getTodos);     // Get all todos

router.route('/todos/:id')
  .put(protect, updateTodo)    // Update a specific todo by id
  .delete(protect, deleteTodo); // Delete a specific todo by id

router.put('/todos/:id/check', protect, toggleTodo);

module.exports = router;

