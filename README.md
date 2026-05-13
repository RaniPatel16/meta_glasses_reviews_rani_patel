# 🕶️ Meta Glasses Reviews — Backend API

> **Full Stack Project | Semester 2 | 80 Marks**  
> Student: Rani Patel | Course: CodingGita

---

## 🔗 Important Links

| Resource | Link |
|---|---|
| 🌐 Live Project | Coming Soon |
| 💻 GitHub Repository | [meta_glasses_reviews_rani_patel](https://github.com/RaniPatel16/meta_glasses_reviews_rani_patel) |
| 📂 Dataset (Google Drive) | [Meta Glasses Reviews JSON](https://drive.google.com/file/d/1nQNBucieSkpd6ykgwNiqR0NCtKX5l6P1/view?usp=drive_link) |
| 📘 Assignment Repo | [CGxSU Semester 1 – Assignment 05](https://github.com/RaniPatel16/CGxSU_Semester_1/tree/main/assignments/05.sem2_full_stack_80_Marks_Project_02) |

---

## 📌 Project Overview

**Meta Glasses Reviews** is a comprehensive full-stack backend platform designed to collect, manage, and analyze real-world customer reviews of **Meta Smart Glasses**. By processing a structured dataset of thousands of review records, the system provides deep insights into customer sentiment, product ratings, regional feedback trends, and purchase verification data.

The platform is built to serve researchers, product managers, and data analysts who need a **centralized, searchable, and analytically powerful** review management system — backed by a robust REST API, MongoDB database, and JWT authentication.

---

## 🎯 Objectives

- Build a scalable **RESTful API** system using **Node.js** and **Express.js**.
- Design a high-performance **MongoDB schema** based on real-world review datasets.
- Implement **advanced multi-parameter filtering**, **regex-based search**, and **aggregation pipelines**.
- Provide **data-driven analytics** including top reviewers, rating trends, and helpfulness scores.
- Ensure **secure user data management** and **authentication** using **JWT (JSON Web Tokens)**.
- Follow **industry-standard MVC architecture** and clean code practices.

---

## ❓ Problem Statement

Understanding customer sentiment on a product like Meta Smart Glasses is difficult due to:

- ❌ **Scattered Reviews:** Customer reviews are spread across multiple platforms with no central aggregation.
- ❌ **Poor Searchability:** No easy way to search reviews by keyword, country, rating range, or verified status.
- ❌ **No Analytics Layer:** Difficult to identify trending sentiment, top reviewers, or regional patterns.
- ❌ **Lack of Structure:** Raw review data has no consistent schema for filtering or sorting operations.
- ❌ **No Secure Access:** Public review data lacks admin control for managing content safely.

---

## 💡 Solution

This project centralizes Meta Glasses review data into a **structured knowledge base** where users can:

- ✅ **Browse Reviews:** Explore detailed records across users, ratings, countries, and dates.
- ✅ **Analyze Sentiment:** View metrics on positive vs negative reviews, helpfulness scores, and rating distributions.
- ✅ **Advanced Filtering:** Filter by region, rating range, verified purchase status, and keywords.
- ✅ **Analytics Dashboard:** Identify the top reviewers, most helpful reviews, and monthly rating trends.
- ✅ **Secure Access:** Protect admin operations and personalized features with **JWT authentication** and **role-based access control**.

---

## 🧠 Dataset Structure

The application is built on a real-world JSON dataset with records structured as follows:

```json
{
  "reviewID": "RVW-001",
  "name": "HebeZ",
  "rating": 5,
  "title": "Amazing smart glasses!",
  "reviewText": "Best AI-powered glasses I have ever used. The Meta AI features are incredible.",
  "date": "2025-12-25",
  "country": "United States",
  "verifiedPurchase": true,
  "helpful": 234,
  "positive": 1,
  "helpfulnessScore": 92.5,
  "profileID": "PRF-001",
  "reviewLink": "https://amazon.com/review/RVW-001",
  "hasImage": true,
  "deviceName": "Meta Ray-Ban Smart Glasses"
}
```

---

## 🗄️ Database Schema Design

The MongoDB schema is optimized for both **analytical queries** and **frequent CRUD operations**:

```js
{
  reviewID:          String   (unique, required),
  name:              String   (required),
  rating:            Number   (min: 1, max: 5, required),
  title:             String,
  reviewText:        String,
  date:              Date,
  country:           String,
  verifiedPurchase:  Boolean,
  helpful:           Number,
  positive:          Number   (0 or 1),
  helpfulnessScore:  Number,
  profileID:         String,
  reviewLink:        String,
  hasImage:          Boolean,
  deviceName:        String,
  isDeleted:         Boolean  (default: false),
  createdAt:         Date     (auto-generated),
  updatedAt:         Date     (auto-updated)
}
```

### ✅ Key Design Decisions

- **Soft Delete:** Reviews use an `isDeleted` flag instead of permanent removal to ensure data safety.
- **Timestamp Tracking:** `createdAt` and `updatedAt` auto-managed via Mongoose `timestamps: true`.
- **Advanced Indexing:** Compound indexes on `rating`, `country`, `verifiedPurchase`, and `date` for millisecond query response.
- **JWT-based Auth:** Stateless authentication to ensure scalability across distributed systems.
- **Embedded Schema:** Core review metrics are embedded in a single document for fast retrieval without joins.

---

## 🏗️ System Architecture

The project follows a **Modular Layered MVC Architecture**:

```
Client (Postman / React Frontend)
        ↓
    Express Server (Routes)
        ↓
   Controllers (Request/Response)
        ↓
    Services (Business Logic)
        ↓
  Models / MongoDB (Data Layer)
        ↓
   Middleware Layer
   (JWT Auth | Rate Limiting | Logger | Error Handler)
```

---

## ✨ Features

### 🔹 Core Features
- Full **CRUD operations** for all review entities.
- **Regex-based search** across review titles, text, and user names.
- **Multi-parameter filtering** — by rating, country, verified status, date, helpful count, and more.
- **Robust pagination** and multi-field **sorting** system.

### 🔹 User Features
- Secure **Registration & Login** with password hashing (**bcryptjs**).
- **JWT-protected routes** for administrative actions.
- **User profile management** with update support.

### 🔹 Analytics & Stats
- **Top Reviewers** — most active users by review count.
- **Most Helpful Reviews** — sorted by helpfulness score.
- **Monthly Average Rating** — using MongoDB aggregation pipeline.
- **Country-wise Review Distribution** — regional breakdown analytics.
- **Positive vs Negative** review ratio stats.

### 🔹 Advanced Features
- **API Rate Limiting** to prevent abuse and brute-force attacks.
- **Standardized API Response** format across all endpoints.
- **Soft Delete** functionality for data safety.
- **Middleware chaining** — Auth → Role → Validation → Controller.
- **Health Check** and **Version** endpoints for deployment monitoring.

---

## ⚙️ API Overview

Base URL: `http://localhost:5000/api/v1`

### 📌 Reviews — CRUD

```
GET     /reviews                     → Fetch all reviews (paginated)
GET     /reviews/:reviewID           → Fetch single review
POST    /reviews                     → Create new review (Auth required)
PUT     /reviews/:reviewID           → Replace complete review (Auth required)
PATCH   /reviews/:reviewID/rating    → Update rating only (Auth required)
DELETE  /reviews/:reviewID           → Soft delete review (Auth required)
```

### 🔍 Search & Filter

```
GET  /search?keyword=battery            → Full-text keyword search
GET  /search/title?keyword=Great        → Search by title
GET  /search/user?keyword=Karla         → Search by user name
GET  /reviews?rating=5                  → Filter by exact rating
GET  /reviews?country=United States     → Filter by country
GET  /reviews?verifiedPurchase=True     → Verified purchases only
GET  /reviews?minRating=3&maxRating=5   → Rating range filter
GET  /reviews?sort=-rating&page=1&limit=10  → Sort + paginate
```

### 📊 Statistics (Aggregation)

```
GET  /stats/average-rating       → Overall average rating
GET  /stats/top-reviewers        → Most active reviewers
GET  /stats/most-helpful         → Highest helpfulness score reviews
GET  /stats/monthly-average      → Monthly rating trend
GET  /stats/country/:country     → Country-specific stats
GET  /stats/positive-reviews     → Total positive review count
GET  /stats/verified-purchases   → Verified purchase percentage
```

### 🔐 Authentication

```
POST  /auth/register          → User registration
POST  /auth/login             → Login + receive JWT token
POST  /auth/logout            → Logout user
GET   /auth/me                → Get current user info
POST  /auth/refresh-token     → Refresh JWT token
POST  /auth/forgot-password   → Request password reset
POST  /auth/reset-password    → Reset forgotten password
```

### 🔐 Admin (Role Protected)

```
GET     /admin/reviews                  → View all reviews (Admin)
POST    /admin/reviews                  → Create review (Admin)
DELETE  /admin/reviews/:reviewID        → Delete review (Admin)
PATCH   /admin/reviews/:reviewID        → Update review (Admin)
GET     /admin/dashboard                → Admin dashboard summary
```

### 🔵 Advanced & Utility

```
GET  /reviews/trending        → Trending reviews
GET  /reviews/recent          → Most recent reviews
GET  /reviews/random          → Random review
GET  /compare?user1=X&user2=Y → Compare two users
GET  /health                  → Server health status
GET  /version                 → API version info
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Security** | Helmet.js, CORS |
| **Rate Limiting** | express-rate-limit |
| **Logging** | Morgan |
| **Config** | dotenv |
| **API Testing** | Postman |

---

## 📂 Project Structure

```
meta_glasses_reviews_rani_patel/
│
├── config/
│   └── db.js                    # MongoDB connection setup
│
├── models/
│   ├── Review.model.js          # Review schema (main dataset)
│   └── User.model.js            # Auth user schema
│
├── controllers/
│   ├── review.controller.js     # Review request/response logic
│   ├── auth.controller.js       # Login, register, JWT logic
│   ├── stats.controller.js      # Aggregation-based statistics
│   └── admin.controller.js      # Admin-only operations
│
├── services/
│   ├── review.service.js        # Review business logic
│   ├── auth.service.js          # Auth business logic
│   └── stats.service.js         # Aggregation pipeline logic
│
├── routes/
│   ├── review.routes.js         # /reviews endpoints
│   ├── auth.routes.js           # /auth endpoints
│   ├── jwt.routes.js            # /jwt protected endpoints
│   ├── admin.routes.js          # /admin endpoints
│   ├── stats.routes.js          # /stats endpoints
│   └── search.routes.js         # /search endpoints
│
├── middlewares/
│   ├── auth.middleware.js       # JWT verification
│   ├── role.middleware.js       # Admin/User role check
│   ├── logger.middleware.js     # Request logging
│   ├── rateLimit.middleware.js  # Rate limiting config
│   └── error.middleware.js      # Global error handler
│
├── utils/
│   ├── apiResponse.js           # Standardized response format
│   ├── pagination.js            # Reusable pagination utility
│   └── filterBuilder.js         # Dynamic MongoDB filter builder
│
├── seed/
│   └── seed.js                  # DB seeding from JSON dataset
│
├── .env.example                 # Sample environment variables
├── .gitignore
├── package.json
├── server.js                    # Application entry point
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/RaniPatel16/meta_glasses_reviews_rani_patel.git
cd meta_glasses_reviews_rani_patel
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/meta_glasses_reviews
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4️⃣ Seed the Database
```bash
node seed/seed.js
```

### 5️⃣ Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server runs at: `http://localhost:5000`

---

## 📥 Data Import Strategy

- **Bulk Insertion:** Using `insertMany()` for high-speed initial seeding from the JSON dataset.
- **Validation:** Strict Mongoose schema validation during data parsing.
- **Transformation:** Mapping flat JSON fields into structured MongoDB documents.
- **Duplicate Prevention:** Checking for existing `reviewID` before inserting.

---

## 📦 Standard API Response Format

All APIs return a **consistent, standardized** response:

```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalRecords": 100,
    "limit": 10
  }
}
```

Error Response:
```json
{
  "success": false,
  "message": "Review not found",
  "error": "No review found with ID: RVW-999"
}
```

---

## 🧪 Testing

- **Postman:** Full API testing for all 80+ endpoints.
- **CRUD Validation:** Ensuring data consistency after create/update/delete operations.
- **Auth Testing:** Verifying JWT token generation, expiry, and protected route blocking.
- **Pagination Testing:** Checking correct page results across large datasets.
- **Aggregation Testing:** Validating stats and analytics pipeline outputs.

---

## 📈 Performance Optimizations

- **Indexing:** Compound indexes on `rating`, `country`, `date`, and `verifiedPurchase`.
- **Pagination:** Response payload limited per request to handle large datasets.
- **Lean Queries:** Using `.lean()` in Mongoose for read-only operations to skip Mongoose overhead.
- **Dynamic Filter Builder:** Query filters built dynamically to avoid unnecessary DB scans.
- **Async Error Handler:** Centralized wrapper removes repeated `try-catch` blocks.

---

## ⚠️ Challenges Faced

- Normalizing a large, flat JSON dataset into a nested MongoDB schema structure.
- Implementing flexible, multi-layered filtering with dynamic query building.
- Balancing embedded vs. referenced data models for optimal query performance.
- Designing a role-based middleware chain that handles auth cleanly without duplication.

---

## 🔮 Future Improvements

- **AI Sentiment Analysis:** Auto-classify reviews as positive/negative using NLP.
- **Interactive Dashboard:** React-based frontend with real-time charts.
- **Export Feature:** Download filtered reviews as CSV or PDF.
- **Real-Time Notifications:** Alert system for new reviews or rating drops.
- **Multilingual Support:** Review translation and language-based filtering.

---

## 📅 Project Timeline

| Phase | Dates | Status |
|---|---|---|
| Backend Development | May 13 – May 28, 2026 | 🟡 In Progress |
| Frontend Development | May 29 – June 13, 2026 | ⏳ Not Started |

---

## 🤝 Contribution

This project is an academic assignment for **CodingGita × SilverOak University — Semester 2**.  
External contributions are currently closed.

---

## 👩‍💻 Developer

**Rani Patel**  
CodingGita | Semester 2 | Full Stack Development  
GitHub: [@RaniPatel16](https://github.com/RaniPatel16)

---

## 📄 License

This project is created for academic purposes as part of the Semester 2 Full Stack curriculum.