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

// @desc    Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ reviewID: req.params.reviewID });
    if (review) {
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch all countries
const getAllCountries = async (req, res) => {
  try {
    const countries = await Review.distinct('country');
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch ratings data
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Review.find({}, 'rating reviewID title');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch verified reviews
const getVerifiedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ verifiedPurchase: true });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by country
const getReviewsByCountry = async (req, res) => {
  try {
    const reviews = await Review.find({ country: req.params.country });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by rating
const getReviewsByRating = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: req.params.rating });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch verified/unverified reviews
const getReviewsByVerifiedStatus = async (req, res) => {
  try {
    // Convert string 'true'/'false' to Boolean
    const status = req.params.status === 'true';
    const reviews = await Review.find({ verifiedPurchase: status });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by title
const getReviewsByTitle = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      title: { $regex: req.params.title, $options: 'i' } 
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
  getReviewsByTitle
};
