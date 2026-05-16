const express = require('express');
const router = express.Router();
const { getAllUsers, getReviewsByUser, getUserStats } = require('../controllers/user.controller');

// URL: /api/v1/users
router.route('/').get(getAllUsers);

// URL: /api/v1/users/:name/reviews
router.get('/:name/reviews', getReviewsByUser);

// URL: /api/v1/users/stats/:name
router.get('/stats/:name', getUserStats);

module.exports = router;
