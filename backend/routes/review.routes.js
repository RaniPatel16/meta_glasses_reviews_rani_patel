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
  getReviewsByTitle,
  getReviewsByDate,
  getReviewsByHelpfulCount,
  getReviewsByPositiveStatus,
  getReviewsByCountryAndRating,
  getCountryStats,
  getReviewsByYear,
  getReviewsByMonth,
  getReviewsByDay,
  getReviewsByUserAndRating
} = require('../controllers/review.controller');

// Main routes for /api/v1/reviews
router.route('/')
  .get(getAllReviews)
  .post(createReview);

// Specific utility routes
router.get('/countries', getAllCountries);
router.get('/ratings', getAllRatings);
router.get('/verified', getVerifiedReviews);

// Statistics routes
router.get('/stats/country/:country', getCountryStats);

// Route Parameters Filters
router.get('/country/:country/reviews', getReviewsByCountry);
router.get('/ratings/:rating', getReviewsByRating);
router.get('/verified/:status', getReviewsByVerifiedStatus);
router.get('/title/:title', getReviewsByTitle);
router.get('/date/:date', getReviewsByDate);
router.get('/helpful/:count', getReviewsByHelpfulCount);
router.get('/positive/:status', getReviewsByPositiveStatus);
router.get('/country/:country/rating/:rating', getReviewsByCountryAndRating);

// Time-based Filters
router.get('/year/:year', getReviewsByYear);
router.get('/month/:month', getReviewsByMonth);
router.get('/day/:day', getReviewsByDay);

// User-specific multi-filter
router.get('/user/:name/rating/:rating', getReviewsByUserAndRating);

// Routes for specific reviews by ID
router.route('/:reviewID')
  .get(getReviewById)
  .put(updateReview)
  .delete(deleteReview);

// Specific patch route for rating
router.route('/:reviewID/rating')
  .patch(updateReviewRating);

module.exports = router;
