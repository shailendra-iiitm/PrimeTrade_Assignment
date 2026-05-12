const express = require('express');
const { body } = require('express-validator');
const {
  getTaskNotes,
  addNote,
  deleteNote
} = require('../../controllers/note.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { apiLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.use(apiLimiter);
router.use(protect);

router.get('/task/:taskId', getTaskNotes);

router.post('/task/:taskId',
  [
    body('content').trim().notEmpty().withMessage('Note content is required')
      .isLength({ max: 1000 }).withMessage('Note cannot exceed 1000 characters')
  ],
  validate,
  addNote
);

router.delete('/:id', deleteNote);

module.exports = router;
