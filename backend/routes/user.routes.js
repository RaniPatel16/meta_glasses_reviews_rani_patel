const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getReviewsByUser, 
  getUserStats 
} = require('../controllers/user.controller');

// URL: /api/v1/users
router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// URL: /api/v1/users/:name/reviews
router.get('/:name/reviews', getReviewsByUser);

// URL: /api/v1/users/stats/:name
router.get('/stats/:name', getUserStats);

module.exports = router;
