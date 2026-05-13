const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// Load models
const Review = require('./models/Review.model');
const User = require('./models/User.model');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/dataset.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    console.log('Starting data import... This might take a moment.');

    // 1. Create or Find a "Mock User" to own the reviews
    let mockUser = await User.findOne({ email: 'admin@metaglasses.com' });
    
    if (!mockUser) {
      mockUser = await User.create({
        name: 'System Admin',
        email: 'admin@metaglasses.com',
        password: 'password123',
        role: 'admin'
      });
    }

    // 2. Prepare the data (Filter empty reviews, Add user ID, and clean types)
    const preparedReviews = reviews
      .filter(review => review.review && review.review.trim() !== '') // Skip empty reviews
      .map(review => ({
      ...review,
      user: mockUser._id, // Assign the mock user
      verifiedPurchase: review.verifiedPurchase === 'True', // Convert "True" string to Boolean
      is_positive_review: review.is_positive_review === '1', // Convert "1" string to Boolean
      rating: parseFloat(review.rating) || 0,
      helpful: parseInt(review.helpful) || 0,
      helpful_aug: parseInt(review.helpful_aug) || 0,
      helpfulness_score: parseFloat(review.helpfulness_score) || 0,
      date: new Date(review.date) // Convert string date to JS Date object
    }));

    // 3. Insert into MongoDB in chunks (1000 at a time)
    const chunkSize = 1000;
    for (let i = 0; i < preparedReviews.length; i += chunkSize) {
      const chunk = preparedReviews.slice(i, i + chunkSize);
      try {
        await Review.insertMany(chunk, { ordered: false }); // ordered: false means keep going even if one fails
        console.log(`Imported ${i + chunk.length} / ${preparedReviews.length} reviews...`);
      } catch (err) {
        console.error(`Chunk starting at ${i} had some issues. Continuing...`);
        console.error(err.message);
      }
    }

    console.log('Data Successfully Imported! ✅');
    process.exit();
  } catch (err) {
    console.error('Error with data import: ❌');
    console.error(err);
    process.exit(1);
  }
};

// Delete Data from DB
const deleteData = async () => {
  try {
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data Successfully Destroyed... 🗑️');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check for command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data.');
  process.exit();
}
