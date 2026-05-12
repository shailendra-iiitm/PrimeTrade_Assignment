const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../../controllers/user.controller');
const { protect, authorize } = require('../../middleware/auth');
const { apiLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.use(apiLimiter);
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);

router.get('/:id', getUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
