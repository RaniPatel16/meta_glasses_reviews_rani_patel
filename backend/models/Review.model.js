const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  reviewID: {
    type: String,
    required: [true, 'Review ID is required'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Review date is required'],
  },
  verifiedPurchase: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  helpful: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
  },
  profile: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  reviewLink: {
    type: String,
    trim: true,
  },
  reviewImage: {
    type: String,
    trim: true,
  },
  helpful_aug: {
    type: Number,
    default: 0,
  },
  is_positive_review: {
    type: Boolean,
    default: true,
  },
  helpfulness_score: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically (Checklist item 19)
});

// Indexing frequently searched fields for performance (Checklist item 15)
ReviewSchema.index({ country: 1, rating: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
