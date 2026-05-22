const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
  getMe,
  deleteAccount
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Authentication Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/refresh-token', refreshToken);

// Protected Auth Routes
router.get('/auth/me', protect, getMe);
router.delete('/auth/account', protect, deleteAccount);

// Profile Routes
router.route('/profile')
  .get(protect, getProfile)
  .patch(protect, updateProfile);

module.exports = router;
