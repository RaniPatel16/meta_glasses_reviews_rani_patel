const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  updateReviewRating
} = require('../controllers/review.controller');

// Main routes for /api/v1/reviews
router.route('/')
  .get(getAllReviews)
  .post(createReview);

// Routes for specific reviews by ID
router.route('/:reviewID')
  .get(getReviewById)
  .put(updateReview);

// Specific patch route for rating
router.route('/:reviewID/rating')
  .patch(updateReviewRating);

module.exports = router;
