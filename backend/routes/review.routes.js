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
  getReviewsByUserAndRating,
  getReviewsByCountryAndVerified,
  getReviewsByHelpfulnessScore,
  getReviewsByProfile,
  getReviewLink,
  getReviewsByImageStatus,
  getReviewsByDevice
} = require('../controllers/review.controller');

// ==========================================
// QUERY PARAMETERS (Handled by the root route)
// E.g., /api/v1/reviews?rating=5
// E.g., /api/v1/reviews?country=United States
// E.g., /api/v1/reviews?verifiedPurchase=True
// E.g., /api/v1/reviews?positive=1
// E.g., /api/v1/reviews?minHelpful=100
// E.g., /api/v1/reviews?maxHelpful=500
// E.g., /api/v1/reviews?name=HebeZ&rating=4
// E.g., /api/v1/reviews?country=USA&positive=1
// E.g., /api/v1/reviews?sort=rating&order=desc
// E.g., /api/v1/reviews?fields=name,rating,title
// ==========================================
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

// ==========================================
// ROUTE PARAMETERS
// ==========================================
router.get('/country/:country/reviews', getReviewsByCountry);
router.get('/ratings/:rating', getReviewsByRating);
router.get('/verified/:status', getReviewsByVerifiedStatus);
router.get('/title/:title', getReviewsByTitle);
router.get('/date/:date', getReviewsByDate);
router.get('/helpful/:count', getReviewsByHelpfulCount);
router.get('/positive/:status', getReviewsByPositiveStatus);
router.get('/country/:country/rating/:rating', getReviewsByCountryAndRating);
router.get('/country/:country/verified/:status', getReviewsByCountryAndVerified);
router.get('/helpfulness/:score', getReviewsByHelpfulnessScore);
router.get('/profile/:profileID', getReviewsByProfile);
router.get('/review-link/:reviewID', getReviewLink);
router.get('/image/:status', getReviewsByImageStatus);
router.get('/device/:deviceName', getReviewsByDevice);

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
