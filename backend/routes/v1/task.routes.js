const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  getAdminAnalytics,
  assignTask
} = require('../../controllers/task.controller');
const { protect, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { apiLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.use(apiLimiter);
router.use(protect);

router.get('/', getTasks);

router.get('/stats', getTaskStats);

router.get('/analytics', authorize('admin'), getAdminAnalytics);

router.post('/:id/assign', authorize('admin'),
  [
    body('userId').notEmpty().withMessage('User ID is required')
      .isMongoId().withMessage('Invalid user ID')
  ],
  validate,
  assignTask
);

router.post('/',
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').trim().notEmpty().withMessage('Description is required')
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('assignedTo').notEmpty().withMessage('Assigned user is required')
      .isMongoId().withMessage('Invalid user ID'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'on-hold', 'cancelled'])
      .withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format')
  ],
  validate,
  createTask
);

router.get('/:id', getTask);

router.put('/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty')
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'on-hold', 'cancelled'])
      .withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority'),
    body('response').optional().isLength({ max: 1000 }).withMessage('Response cannot exceed 1000 characters'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format')
  ],
  validate,
  updateTask
);

router.delete('/:id', deleteTask);

module.exports = router;
