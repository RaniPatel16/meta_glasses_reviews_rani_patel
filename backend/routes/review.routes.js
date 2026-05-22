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
  getReviewsByDevice,
  getPositiveReviews,
  getNegativeReviews,
  getLatestReviews,
  getHelpfulReviews,
  getReviewStats,
  searchReviews,
  searchReviewsByTitle,
  searchReviewsByUser,
  searchReviewsQ,
  searchCountryQ,
  searchUsersQ,
  getAverageRating,
  getHighestRating,
  getLowestRating,
  getUserStatsAlias
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
// E.g., /api/v1/reviews?search=battery
// E.g., /api/v1/reviews?contains=Meta
// E.g., /api/v1/reviews?exactRating=5
// E.g., /api/v1/reviews?year=2025
// E.g., /api/v1/reviews?month=12
// E.g., /api/v1/reviews?day=25
// E.g., /api/v1/reviews?title=Great
// E.g., /api/v1/reviews?minRating=3&maxRating=5
// E.g., /api/v1/reviews?hasImage=true
// E.g., /api/v1/reviews?hasReviewText=true
// 
// COMBINED QUERIES (Pagination + Sorting + Filtering)
// E.g., /api/v1/reviews?country=USA&page=1&limit=10&sort=-rating
// E.g., /api/v1/reviews?rating=5&page=2&limit=5
// E.g., /api/v1/reviews?positive=1&sort=helpful
// E.g., /api/v1/reviews?verifiedPurchase=True&page=1&limit=20
// E.g., /api/v1/reviews?keyword=AI&sort=-date
// E.g., /api/v1/reviews?country=IND&rating=4&page=1&limit=10
// ==========================================
// Main routes for /api/v1/reviews
router.route('/')
  .get(getAllReviews)
  .post(createReview);

// Specific utility routes
router.get('/countries', getAllCountries);
router.get('/ratings', getAllRatings);
router.get('/verified', getVerifiedReviews);

// Positive/Negative explicit routes
router.get('/positive', getPositiveReviews);
router.get('/negative', getNegativeReviews);

// Latest and Helpful routes
router.get('/latest', getLatestReviews);
router.get('/helpful', getHelpfulReviews);

// Statistics routes
router.get('/stats/reviews', getReviewStats);
router.get('/stats/average-rating', getAverageRating);
router.get('/stats/highest-rating', getHighestRating);
router.get('/stats/lowest-rating', getLowestRating);
router.get('/stats/country/:country', getCountryStats);
router.get('/stats/user/:name', getUserStatsAlias);

// Explicit Search routes (keyword)
router.get('/search', searchReviews);
router.get('/search/title', searchReviewsByTitle);
router.get('/search/user', searchReviewsByUser);

// Explicit Search routes (q)
router.get('/search/reviews', searchReviewsQ);
router.get('/search/country', searchCountryQ);
router.get('/search/users', searchUsersQ);

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
