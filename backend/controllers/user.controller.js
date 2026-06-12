const User = require('../models/User.model');

// @desc    Fetch all users
const getAllUsers = async (req, res) => {
  try {
    let mongooseQuery = User.find({});
    
    // Pagination Logic
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      mongooseQuery = mongooseQuery.skip(startIndex).limit(limit);
    }
    
    const users = await mongooseQuery;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by user name
const getReviewsByUser = async (req, res) => {
  try {
    // We search the Review collection using the 'name' field
    const Review = require('../models/Review.model');
    const reviews = await Review.find({ name: req.params.name });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch user statistics
const getUserStats = async (req, res) => {
  try {
    const Review = require('../models/Review.model');
    const stats = await Review.aggregate([
      { $match: { name: req.params.name } },
      {
        $group: {
          _id: '$name',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalHelpful: { $sum: '$helpful' }
        }
      }
    ]);

    if (stats.length > 0) {
      res.json(stats[0]);
    } else {
      res.status(404).json({ message: 'No stats found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getReviewsByUser,
  getUserStats
};
