const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/user.controller');

// URL: /api/v1/users
router.route('/').get(getAllUsers);

module.exports = router;
