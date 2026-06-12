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
const { protect, authorize } = require('../middlewares/auth.middleware');

// Token Management Routes
router.post('/generate-token', generateToken);
router.post('/verify-token', verifyToken);
router.post('/refresh-token', refreshJwtToken);

// Protected Routes
router.route('/profile')
  .get(protect, getJwtProfile)
  .options((req, res) => {
    res.header('Allow', 'GET, OPTIONS');
    res.status(200).end();
  });
router.get('/dashboard', protect, getJwtDashboard);

// Role-Based Protected Routes
router.get('/admin', protect, authorize('admin'), getJwtAdmin);
router.get('/user', protect, authorize('user', 'admin'), getJwtUser);

// Session Management
router.delete('/logout', protect, logoutJwt);

module.exports = router;
