const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./models/review.model');
const User = require('./models/user.model');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    const reviews = JSON.parse(fs.readFileSync('./dataset.json', 'utf-8'));
    
    // 1. Get or Create Admin User
    let user = await User.findOne({ email: 'admin@metaglasses.com' });
    if (!user) {
      user = await User.create({ name: 'Admin', email: 'admin@metaglasses.com', password: 'password123', role: 'admin' });
    }

    // 2. Map data (Simpler style)
    const sampleData = reviews.filter(r => r.review).map(review => ({
      ...review,
      user: user._id,
      verifiedPurchase: review.verifiedPurchase === 'True',
      is_positive_review: review.is_positive_review === '1',
      date: new Date(review.date)
    }));

    // 3. Insert data (Chunked to prevent crash)
    for (let i = 0; i < sampleData.length; i += 1000) {
      await Review.insertMany(sampleData.slice(i, i + 1000), { ordered: false });
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
