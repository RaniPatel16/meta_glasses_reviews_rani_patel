const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  updateReviewRating,
  deleteReview,
  getAllCountries,
  getAllRatings,
  getVerifiedReviews,
  getReviewsByCountry,
  getReviewsByRating,
  getReviewsByVerifiedStatus,
  getReviewsByTitle
} = require('../controllers/review.controller');

// Main routes for /api/v1/reviews
router.route('/')
  .get(getAllReviews)
  .post(createReview);

// Specific utility routes
router.get('/countries', getAllCountries);
router.get('/ratings', getAllRatings);
router.get('/verified', getVerifiedReviews);

// Route Parameters Filters
router.get('/country/:country/reviews', getReviewsByCountry);
router.get('/ratings/:rating', getReviewsByRating);
router.get('/verified/:status', getReviewsByVerifiedStatus);
router.get('/title/:title', getReviewsByTitle);

// Routes for specific reviews by ID
router.route('/:reviewID')
  .get(getReviewById)
  .put(updateReview)
  .delete(deleteReview);

// Specific patch route for rating
router.route('/:reviewID/rating')
  .patch(updateReviewRating);

module.exports = router;
