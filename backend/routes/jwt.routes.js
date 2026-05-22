const express = require('express');
const router = express.Router();
const {
  getJwtProfile,
  getJwtDashboard,
  generateToken,
  verifyToken,
  refreshJwtToken,
  getJwtAdmin,
  getJwtUser,
  logoutJwt
} = require('../controllers/jwt.controller');
const { protect, authorize } = require('../middleware/auth');

// Token Management Routes
router.post('/generate-token', generateToken);
router.post('/verify-token', verifyToken);
router.post('/refresh-token', refreshJwtToken);

// Protected Routes
router.get('/profile', protect, getJwtProfile);
router.get('/dashboard', protect, getJwtDashboard);

// Role-Based Protected Routes
router.get('/admin', protect, authorize('admin'), getJwtAdmin);
router.get('/user', protect, authorize('user', 'admin'), getJwtUser);

// Session Management
router.delete('/logout', protect, logoutJwt);

module.exports = router;
