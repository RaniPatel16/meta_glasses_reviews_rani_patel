const rateLimit = require('express-rate-limit');

// 1. GET /reviews - Limit requests per minute (e.g., 60 req/min)
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { message: 'Too many requests from this IP, please try again after a minute' }
});

// 2. POST /auth/login - Prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

// 3. POST /auth/register - Limit registration requests
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { message: 'Too many accounts created from this IP, please try again after an hour' }
});

// 4. GET /search - Limit excessive searches
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: { message: 'Too many search queries, please slow down' }
});

// 5. GET /admin/dashboard - Strict admin rate limiting
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests to admin dashboard' }
});

// 6. POST /reviews - Prevent spam review creation
const createReviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'You can only post 5 reviews per hour' }
});

// 7. DELETE /reviews/:reviewID - Limit delete requests
const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many delete requests' }
});

// 8. POST /import/json - Limit bulk uploads
const importLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 2,
  message: { message: 'You can only perform bulk imports twice per day' }
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  searchLimiter,
  adminLimiter,
  createReviewLimiter,
  deleteLimiter,
  importLimiter
};
