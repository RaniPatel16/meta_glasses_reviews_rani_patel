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

    // Sorting Logic (e.g. ?sort=rating&order=desc or ?sort=-rating)
    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' ');
      if (req.query.order === 'desc' && !sortBy.includes('-')) {
        sortBy = '-' + sortBy;
      }
      mongooseQuery = mongooseQuery.sort(sortBy);
    }

    // Selecting Fields (?fields=name,rating,title)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      mongooseQuery = mongooseQuery.select(fields);
    }
    
    // Pagination Logic
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      mongooseQuery = mongooseQuery.skip(startIndex).limit(limit);
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
    // Handles Missing required fields via Mongoose ValidationError
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
      // Handles Invalid/Missing review ID
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    // Handles invalid update data via Mongoose validation
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
      // Handles already deleted review scenario
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
    
    // Pagination Logic
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      return res.json(countries.slice(startIndex, endIndex));
    }
    
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

// @desc    Fetch paginated positive reviews
const getPositiveReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ is_positive_review: true })
      .skip(startIndex)
      .limit(limit);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch paginated negative reviews
const getNegativeReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ is_positive_review: false })
      .skip(startIndex)
      .limit(limit);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch paginated latest reviews
const getLatestReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({})
      .sort({ date: -1 })
      .skip(startIndex)
      .limit(limit);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch paginated helpful reviews
const getHelpfulReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ helpful: { $gt: 0 } })
      .sort({ helpful: -1 })
      .skip(startIndex)
      .limit(limit);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch paginated review statistics (grouped by title)
const getReviewStats = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const stats = await Review.aggregate([
      {
        $group: {
          _id: '$title',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalHelpful: { $sum: '$helpful' }
        }
      },
      { $sort: { totalReviews: -1 } },
      { $skip: startIndex },
      { $limit: limit }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search reviews by general keyword
const searchReviews = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const reviews = await Review.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { review: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search reviews by title keyword
const searchReviewsByTitle = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const reviews = await Review.find({
      title: { $regex: keyword, $options: 'i' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search reviews specifically by user keyword
const searchReviewsByUser = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const reviews = await Review.find({
      name: { $regex: keyword, $options: 'i' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search reviews by 'q' query
const searchReviewsQ = async (req, res) => {
  try {
    const q = req.query.q || '';
    const reviews = await Review.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { review: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search countries by 'q'
const searchCountryQ = async (req, res) => {
  try {
    const q = req.query.q || '';
    const reviews = await Review.find({
      country: { $regex: q, $options: 'i' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users by 'q'
const searchUsersQ = async (req, res) => {
  try {
    const q = req.query.q || '';
    const reviews = await Review.find({
      name: { $regex: q, $options: 'i' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch average rating
const getAverageRating = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    res.json(stats.length > 0 ? stats[0] : { averageRating: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch highest rating
const getHighestRating = async (req, res) => {
  try {
    const highest = await Review.findOne().sort({ rating: -1 }).limit(1);
    res.json(highest ? highest : { message: 'No reviews found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch lowest rating
const getLowestRating = async (req, res) => {
  try {
    const lowest = await Review.findOne().sort({ rating: 1 }).limit(1);
    res.json(lowest ? lowest : { message: 'No reviews found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch user statistics (alias for /stats/user/:name)
const getUserStatsAlias = async (req, res) => {
  try {
    const name = req.params.name;
    const stats = await Review.aggregate([
      { $match: { name: name } },
      {
        $group: {
          _id: '$name',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalHelpful: { $sum: '$helpful' }
        }
      }
    ]);
    res.json(stats.length > 0 ? stats[0] : { message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch positive reviews statistics
const getPositiveReviewsStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { is_positive_review: true } },
      {
        $group: {
          _id: null,
          totalPositive: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    res.json(stats.length > 0 ? stats[0] : { totalPositive: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch negative reviews statistics
const getNegativeReviewsStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { is_positive_review: false } },
      {
        $group: {
          _id: null,
          totalNegative: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    res.json(stats.length > 0 ? stats[0] : { totalNegative: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch top reviewers
const getTopReviewers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const topReviewers = await Review.aggregate([
      {
        $group: {
          _id: '$name',
          totalReviews: { $sum: 1 },
          totalHelpful: { $sum: '$helpful' }
        }
      },
      { $sort: { totalReviews: -1 } },
      { $limit: limit }
    ]);
    res.json(topReviewers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch most helpful reviews
const getMostHelpfulReviewsStats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const mostHelpful = await Review.find().sort({ helpful: -1 }).limit(limit);
    res.json(mostHelpful);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch verified purchase statistics
const getVerifiedPurchasesStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { verifiedPurchase: true } },
      {
        $group: {
          _id: null,
          totalVerified: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    res.json(stats.length > 0 ? stats[0] : { totalVerified: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADVANCE ROUTES
// ==========================================

// @desc    Fetch highest rated reviews
const getTopHighestRatedReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ rating: -1 }).limit(10);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch lowest rated reviews
const getTopLowestRatedReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ rating: 1 }).limit(10);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate monthly average rating
const getMonthlyAverageRating = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Compare two users
const compareTwoUsers = async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    const statsUser1 = await Review.aggregate([
      { $match: { name: user1 } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 }, helpful: { $sum: '$helpful' } } }
    ]);
    const statsUser2 = await Review.aggregate([
      { $match: { name: user2 } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 }, helpful: { $sum: '$helpful' } } }
    ]);
    res.json({
      [user1]: statsUser1[0] || null,
      [user2]: statsUser2[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Compare ratings
const compareRatings = async (req, res) => {
  try {
    const { rating1, rating2 } = req.query;
    const r1 = parseInt(rating1);
    const r2 = parseInt(rating2);
    const count1 = await Review.countDocuments({ rating: r1 });
    const count2 = await Review.countDocuments({ rating: r2 });
    res.json({
      [`Rating_${r1}`]: count1,
      [`Rating_${r2}`]: count2
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch random review
const getRandomReview = async (req, res) => {
  try {
    const random = await Review.aggregate([{ $sample: { size: 1 } }]);
    res.json(random[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch trending reviews
const getTrendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ helpful: -1, date: -1 })
      .limit(10);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPositiveReviews,
  getNegativeReviews,
  getLatestReviews,
  getHelpfulReviews,
  getReviewStats,
  searchReviews,
  searchReviewsByTitle,
  searchReviewsByUser,
  searchReviewsQ,
  searchCountryQ,
  searchUsersQ,
  getAverageRating,
  getHighestRating,
  getLowestRating,
  getUserStatsAlias,
  getPositiveReviewsStats,
  getNegativeReviewsStats,
  getTopReviewers,
  getMostHelpfulReviewsStats,
  getVerifiedPurchasesStats,
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
  getReviewsByDevice,
  getTopHighestRatedReviews,
  getTopLowestRatedReviews,
  getMonthlyAverageRating,
  compareTwoUsers,
  compareRatings,
  getRandomReview,
  getTrendingReviews
};
