const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../../controllers/auth.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { authLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required')
      .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('email').isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
  ],
  validate,
  register
);

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

module.exports = router;
