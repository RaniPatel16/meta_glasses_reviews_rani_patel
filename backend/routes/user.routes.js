const express = require('express');
const router = express.Router();
const { getAllUsers, getReviewsByUser } = require('../controllers/user.controller');

// URL: /api/v1/users
router.route('/').get(getAllUsers);

// URL: /api/v1/users/:name/reviews
router.get('/:name/reviews', getReviewsByUser);

module.exports = router;
