const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Authentication Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// Profile Routes
router.route('/profile')
  .get(protect, getProfile)
  .patch(protect, updateProfile);

module.exports = router;
