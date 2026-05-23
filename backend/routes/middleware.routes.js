const express = require('express');
const router = express.Router();
const { adminLimiter } = require('../middleware/rateLimiter');
const {
  getAdminReviews,
  createAdminReview,
  deleteAdminReview,
  updateAdminReview,
  getAdminDashboard,
  getProtectedReviews,
  createProtectedReview,
  deleteProtectedReview
} = require('../controllers/middleware.controller');
const { protect, authorize } = require('../middleware/auth');

// Admin Routes (Requires both authentication and admin role)
router.route('/admin/reviews')
  .get(protect, authorize('admin'), getAdminReviews)
  .post(protect, authorize('admin'), createAdminReview)
  .options((req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.status(200).end();
  });

router.route('/admin/reviews/:reviewID')
  .delete(protect, authorize('admin'), deleteAdminReview)
  .patch(protect, authorize('admin'), updateAdminReview);

router.get('/admin/dashboard', protect, authorize('admin'), adminLimiter, getAdminDashboard);

// Protected Routes (Requires authentication only)
router.route('/protected/reviews')
  .get(protect, getProtectedReviews)
  .post(protect, createProtectedReview);

router.route('/protected/reviews/:reviewID')
  .delete(protect, deleteProtectedReview);

module.exports = router;
