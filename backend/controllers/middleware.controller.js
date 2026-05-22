const Review = require('../models/Review.model');

// @desc    Access admin reviews
// @route   GET /api/v1/admin/reviews
const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json({ message: 'Admin access granted', count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin create review
// @route   POST /api/v1/admin/reviews
const createAdminReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ message: 'Review created by admin', data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin delete review
// @route   DELETE /api/v1/admin/reviews/:reviewID
const deleteAdminReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewID);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted by admin', data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin update review
// @route   PATCH /api/v1/admin/reviews/:reviewID
const updateAdminReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.reviewID, req.body, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review updated by admin', data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Access admin dashboard
// @route   GET /api/v1/admin/dashboard
const getAdminDashboard = (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard', user: req.user });
};

// @desc    Access protected reviews
// @route   GET /api/v1/protected/reviews
const getProtectedReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json({ message: 'Protected access granted', count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create protected review
// @route   POST /api/v1/protected/reviews
const createProtectedReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ message: 'Protected review created', data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete protected review
// @route   DELETE /api/v1/protected/reviews/:reviewID
const deleteProtectedReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewID);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Protected review deleted', data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminReviews,
  createAdminReview,
  deleteAdminReview,
  updateAdminReview,
  getAdminDashboard,
  getProtectedReviews,
  createProtectedReview,
  deleteProtectedReview
};
