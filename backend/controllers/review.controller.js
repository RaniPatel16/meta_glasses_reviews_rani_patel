const Review = require('../models/review.model');

// @desc    Fetch all reviews (with Query Parameters support)
const getAllReviews = async (req, res) => {
  try {
    let query = {};

    // ==========================================
    // QUERY PARAMETERS LOGIC
    // ==========================================
    if (req.query.rating) query.rating = req.query.rating;
    if (req.query.exactRating) query.rating = req.query.exactRating;
    
    // Rating Range
    if (req.query.minRating || req.query.maxRating) {
      if (typeof query.rating !== 'object') query.rating = {};
      if (req.query.minRating) query.rating.$gte = parseInt(req.query.minRating);
      if (req.query.maxRating) query.rating.$lte = parseInt(req.query.maxRating);
    }

    if (req.query.country) query.country = req.query.country;
    if (req.query.name) query.name = req.query.name;
    if (req.query.language) query.language = { $regex: req.query.language, $options: 'i' };
    
    // Text Search Options
    if (req.query.search || req.query.keyword) {
      const searchTerm = req.query.search || req.query.keyword;
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { review: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    if (req.query.contains) {
      query.review = { $regex: req.query.contains, $options: 'i' };
    }
    if (req.query.reviewContains) {
      query.review = { $regex: req.query.reviewContains, $options: 'i' };
    }
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }
    if (req.query.titleContains) {
      query.title = { $regex: req.query.titleContains, $options: 'i' };
    }
    
    // Presence Checks
    if (req.query.hasImage) {
      if (req.query.hasImage === 'true') query.reviewImage = { $exists: true, $ne: '' };
      else query.reviewImage = { $in: [null, ''] };
    }
    
    if (req.query.hasReviewText) {
      if (req.query.hasReviewText === 'true') query.review = { $exists: true, $ne: '' };
      else query.review = { $in: [null, ''] };
    }
    
    // Time-based queries (Year/Month/Day)
    let exprAnd = [];
    if (req.query.year) {
      exprAnd.push({ $eq: [{ $year: '$date' }, parseInt(req.query.year)] });
    }
    if (req.query.month) {
      exprAnd.push({ $eq: [{ $month: '$date' }, parseInt(req.query.month)] });
    }
    if (req.query.day) {
      exprAnd.push({ $eq: [{ $dayOfMonth: '$date' }, parseInt(req.query.day)] });
    }
    if (req.query.date) {
      const d = new Date(req.query.date);
      if (!isNaN(d)) {
        exprAnd.push({ $eq: [{ $year: '$date' }, d.getUTCFullYear()] });
        exprAnd.push({ $eq: [{ $month: '$date' }, d.getUTCMonth() + 1] });
        exprAnd.push({ $eq: [{ $dayOfMonth: '$date' }, d.getUTCDate()] });
      }
    }
    if (exprAnd.length > 0) {
      query.$expr = { $and: exprAnd };
    }

    if (req.query.verifiedPurchase) {
      query.verifiedPurchase = req.query.verifiedPurchase === 'True' || req.query.verifiedPurchase === 'true';
    }
    
    if (req.query.positive) {
      query.is_positive_review = req.query.positive === '1' || req.query.positive === 'true';
    }
    
    // Helpfulness range
    if (req.query.minHelpful || req.query.maxHelpful) {
      query.helpful = {};
      if (req.query.minHelpful) query.helpful.$gte = parseInt(req.query.minHelpful);
      if (req.query.maxHelpful) query.helpful.$lte = parseInt(req.query.maxHelpful);
    }
    
    if (req.query.hasHelpful) {
      if (req.query.hasHelpful === 'true') {
        if (!query.helpful) query.helpful = {};
        query.helpful.$gt = 0;
      }
    }

    // Build the Mongoose Query
    let mongooseQuery = Review.find(query);

    // Sorting Logic (?sort=rating&order=desc)
    if (req.query.sort) {
      const sortField = req.query.sort;
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
      mongooseQuery = mongooseQuery.sort({ [sortField]: sortOrder });
    }

    // Selecting Fields (?fields=name,rating,title)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      mongooseQuery = mongooseQuery.select(fields);
    }

    // Execute the final query
    const reviews = await mongooseQuery;
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


    // ==========================================
    // route parameters
    // ==========================================


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

// @desc    Fetch reviews by date
const getReviewsByDate = async (req, res) => {
  try {
    const reviews = await Review.find({ date: new Date(req.params.date) });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by helpful count
const getReviewsByHelpfulCount = async (req, res) => {
  try {
    const reviews = await Review.find({ helpful: req.params.count });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch positive/negative reviews
const getReviewsByPositiveStatus = async (req, res) => {
  try {
    const status = req.params.status === 'true';
    const reviews = await Review.find({ is_positive_review: status });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch country reviews by rating
const getReviewsByCountryAndRating = async (req, res) => {
  try {
    const { country, rating } = req.params;
    const reviews = await Review.find({ country: country, rating: rating });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
// @desc    Fetch country statistics
const getCountryStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { country: req.params.country } },
      {
        $group: {
          _id: '$country',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    if (stats.length > 0) res.json(stats[0]);
    else res.status(404).json({ message: 'No stats for this country' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by year
const getReviewsByYear = async (req, res) => {
  try {
    const reviews = await Review.find({
      $expr: { $eq: [{ $year: '$date' }, parseInt(req.params.year)] }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by month
const getReviewsByMonth = async (req, res) => {
  try {
    const reviews = await Review.find({
      $expr: { $eq: [{ $month: '$date' }, parseInt(req.params.month)] }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by day
const getReviewsByDay = async (req, res) => {
  try {
    const reviews = await Review.find({
      $expr: { $eq: [{ $dayOfMonth: '$date' }, parseInt(req.params.day)] }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch user reviews by rating
const getReviewsByUserAndRating = async (req, res) => {
  try {
    const { name, rating } = req.params;
    const reviews = await Review.find({ name: name, rating: rating });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch verified country reviews
const getReviewsByCountryAndVerified = async (req, res) => {
  try {
    const { country, status } = req.params;
    const isVerified = status === 'true';
    const reviews = await Review.find({ country: country, verifiedPurchase: isVerified });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by helpfulness score
const getReviewsByHelpfulnessScore = async (req, res) => {
  try {
    const reviews = await Review.find({ helpfulness_score: req.params.score });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by profile ID
const getReviewsByProfile = async (req, res) => {
  try {
    const reviews = await Review.find({ profile: req.params.profileID });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch review link
const getReviewLink = async (req, res) => {
  try {
    const review = await Review.findOne({ reviewID: req.params.reviewID }, 'reviewLink reviewID');
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews with/without images
const getReviewsByImageStatus = async (req, res) => {
  try {
    const hasImage = req.params.status === 'true';
    let query = {};
    if (hasImage) {
      query = { reviewImage: { $exists: true, $ne: '' } };
    } else {
      query = { $or: [{ reviewImage: { $exists: false } }, { reviewImage: '' }] };
    }
    const reviews = await Review.find(query);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch reviews by device name
const getReviewsByDevice = async (req, res) => {
  try {
    const reviews = await Review.find({ device: req.params.deviceName });
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
  getReviewsByTitle,
  getReviewsByDate,
  getReviewsByHelpfulCount,
  getReviewsByPositiveStatus,
  getReviewsByCountryAndRating,
  getCountryStats,
  getReviewsByYear,
  getReviewsByMonth,
  getReviewsByDay,
  getReviewsByUserAndRating,
  getReviewsByCountryAndVerified,
  getReviewsByHelpfulnessScore,
  getReviewsByProfile,
  getReviewLink,
  getReviewsByImageStatus,
  getReviewsByDevice
};
