const Review = require('../models/review.model');

// @desc    Fetch all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({ reviewID: req.params.reviewID });
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
const createReview = async (req, res) => {
  try {
    // Check if review already exists
    const existedReview = await Review.findOne({ reviewID: req.body.reviewID });
    if (existedReview) {
      return res.status(409).json({ message: 'Review with this ID already exists' });
    }

    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Replace complete review
const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { reviewID: req.params.reviewID },
      req.body,
      { new: true, runValidators: true }
    );
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update review rating
const updateReviewRating = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }

    const review = await Review.findOneAndUpdate(
      { reviewID: req.params.reviewID },
      { rating },
      { new: true, runValidators: true }
    );
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  updateReviewRating
};
