# Meta Glasses Reviews API

## Overview
The **Meta Glasses Reviews API** is a robust, fully-featured backend application built to manage, analyze, and serve customer reviews for Meta Glasses. It is designed using industry-standard Node.js, Express, and MongoDB, fully adhering to MVC (Model-View-Controller) architecture.

This project was built to process extensive JSON review datasets, manage user authentication, provide advanced search/filtering capabilities, and support complex data aggregation.

---

## 🚀 Features (Implemented from Checklist)

### 1. Core Backend & Database Setup
- **Express.js Server**: Clean, modular server configuration.
- **MongoDB via Mongoose**: Secure database connection with scalable schema design.
- **MVC Architecture**: Clear separation of `controllers`, `models`, `routes`, and `middlewares`.

### 2. Comprehensive CRUD Operations
- Create, Read, Update, and Delete capabilities for Reviews and Users.
- Full support for route parameters (`/:id`) and complex query strings (`?sort=...&limit=...`).

### 3. Advanced Querying & Aggregation
- Extensive filtering options (by rating, country, helpfulness, verified status, etc.).
- MongoDB Aggregation pipelines utilized for fetching top reviews, computing averages, and detailed statistics.

### 4. Authentication System (JWT)
- Secure user registration, login, and logout.
- Protected routes using JWT (JSON Web Tokens) verification.
- Password hashing utilizing `bcryptjs`.
- Role-Based Access Control (RBAC) via custom authorization middleware.

### 5. Middleware & Security
- `cors` implemented for cross-origin request handling.
- `express-rate-limit` to protect endpoints against brute-force and spam attacks.
- `morgan` implemented for detailed request logging.
- Global Error Handling middleware to catch and format API errors consistently.

---

## 📂 Folder Structure Explained

```text
/backend
│
├── config/              # Configuration files (Database connection logic)
│   └── db.js            # MongoDB connection setup
│
├── controllers/         # Core business logic for handling requests & responses
│   ├── auth.controller.js
│   ├── review.controller.js
│   └── user.controller.js
│
├── middlewares/         # Custom Express middlewares (Security, validation, auth)
│   ├── auth.middleware.js       # JWT verification & RBAC
│   └── rateLimiter.middleware.js # API rate limiting rules
│
├── models/              # Mongoose database schemas (Data structure & validation)
│   ├── Review.model.js
│   └── User.model.js
│
├── routes/              # API Route definitions mapping URLs to controllers
│   ├── auth.routes.js
│   ├── review.routes.js
│   └── user.routes.js
│
├── .env                 # Environment variables (Database URI, JWT Secret, Port)
├── app.js               # Express application setup (Middlewares, Route mounting)
├── server.js            # Entry point for starting the Node.js server
├── seeder.js            # Utility script to populate database from JSON dataset
└── package.json         # Project dependencies and script definitions
```

---

## ⚙️ Project Setup & Installation Steps

Follow these steps to run the API locally on your machine:

**1. Clone or Download the Repository**
Navigate to the `backend` directory in your terminal.

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Ensure your `.env` file contains the following (adjust values as needed):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/meta_glasses_reviews
JWT_SECRET=your_super_secret_jwt_key_123
```

**4. Seed the Database (Optional but Recommended)**
If you want to populate your database using the provided `dataset.json`:
```bash
node seeder.js
```

**5. Start the Server**
For production/standard mode:
```bash
npm start
```

For development mode (auto-restarts using nodemon):
```bash
npm run dev
```

**6. Verify Health**
Open your browser or Postman and navigate to:
```
http://localhost:5000/api/v1/health
```
You should receive a `{"status": "UP"}` response.

---

## 📖 API Documentation (Postman)

A Postman collection (`Meta_Glasses_Postman_Collection.json`) has been generated and placed in the project root. 
To test the APIs:
1. Open Postman.
2. Click **Import** > **File** > Select `Meta_Glasses_Postman_Collection.json`.
3. Use the imported collection to test Auth, Reviews, and Advanced Queries.
