const User = require('../models/user.model');

// @desc    Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by user name
const getReviewsByUser = async (req, res) => {
  try {
    // We search the Review collection using the 'name' field
    const Review = require('../models/review.model');
    const reviews = await Review.find({ name: req.params.name });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getReviewsByUser
};
