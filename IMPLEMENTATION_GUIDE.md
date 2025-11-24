# GiftOfficial - Complete Implementation Guide

## Project Configuration

**Environment (.env)**
```
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=giftonline_db
DB_USER=giftonline_user
DB_PASSWORD=AzgR8$Zq

# JWT Secret
JWT_SECRET=MWJmYjNhYTgtNDg1OC00MWQzLTk0MjMtYTkwY2NjMDQ5ZGM1MzFiYTdkYjMtNzFjOS00MmE2LTk3NTUtZjg5NWE0OGU3YzFm
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Backend Implementation Status

### ✅ Completed Files:
1. **Config/env.js** - Environment configuration with proper variable parsing
2. **Config/database.js** - Knex database connection setup
3. **Controllers/authController.js** - User registration and login
4. **Controllers/productController.js** - Product CRUD operations
5. **Controllers/categoryController.js** - Category CRUD operations
6. **Controllers/reviewController.js** - Review CRUD operations
7. **package.json** - All dependencies configured
8. **knexfile.js** - Knex configuration for migrations
9. **.env** - Environment variables set

### 📋 Remaining Files to Create:

#### Backend Middleware:
```
src/middleware/auth.js - JWT verification middleware
src/middleware/validation.js - Request validation middleware
```

#### Backend Routes:
```
src/routes/authRoutes.js - Authentication routes
src/routes/productRoutes.js - Product routes
src/routes/categoryRoutes.js - Category routes
src/routes/reviewRoutes.js - Review routes
```

#### Database Migrations:
```
src/database/migrations/001_create_users_table.js
src/database/migrations/002_create_categories_table.js
src/database/migrations/003_create_products_table.js
src/database/migrations/004_create_reviews_table.js
```

#### Main Server:
```
src/server.js - Express server setup (PORT 5000)
```

### Frontend (React + Vite):
- All component files and pages
- API service integration
- Context API for auth state management
- Styles and CSS files

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  stock INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints Documentation

### Authentication Endpoints
- **POST** `/api/auth/register` - Register new user (No auth required)
- **POST** `/api/auth/login` - Login user (No auth required)
- **GET** `/api/auth/profile` - Get user profile (Auth required)
- **PUT** `/api/auth/profile` - Update user profile (Auth required)

### Category Endpoints
- **GET** `/api/categories` - Get all categories (No auth required)
- **GET** `/api/categories/:id` - Get category by ID (No auth required)
- **POST** `/api/categories` - Create category (Admin only)
- **PUT** `/api/categories/:id` - Update category (Admin only)
- **DELETE** `/api/categories/:id` - Delete category (Admin only)

### Product Endpoints
- **GET** `/api/products` - Get all products (No auth required)
- **GET** `/api/products/:id` - Get product by ID (No auth required)
- **POST** `/api/products` - Create product (Admin only)
- **PUT** `/api/products/:id` - Update product (Admin only)
- **DELETE** `/api/products/:id` - Delete product (Admin only)

### Review Endpoints
- **GET** `/api/reviews` - Get all reviews (No auth required)
- **GET** `/api/reviews/product/:productId` - Get reviews for product (No auth required)
- **POST** `/api/reviews` - Create review (Auth required)
- **PUT** `/api/reviews/:id` - Update review (Auth required)
- **DELETE** `/api/reviews/:id` - Delete review (Auth required)

---

## Running the Application

### Prerequisites:
1. Node.js v16+ installed
2. PostgreSQL installed and running
3. Create database and user:
   ```sql
   CREATE DATABASE giftonline_db;
   CREATE USER giftonline_user WITH PASSWORD 'AzgR8$Zq';
   GRANT ALL PRIVILEGES ON DATABASE giftonline_db TO giftonline_user;
   ```

### Backend Setup:
```bash
cd D:\Giftofficial\backend
npm install
npm run migrate
npm run dev
# Server running on http://localhost:5000
```

### Frontend Setup:
```bash
cd D:\Giftofficial\frontend
npm install
npm run dev
# App running on http://localhost:5173
```

---

## Key Implementation Details

### Authentication Flow:
1. User registers with name, email, password
2. Password hashed with bcryptjs (10 rounds)
3. User logged in, JWT token generated
4. Token stored in localStorage on frontend
5. Token sent in Authorization header for protected routes
6. Middleware verifies token and attaches user to request

### Admin Operations:
- Only users with `role: 'admin'` can create/update/delete products and categories
- Middleware checks user role before allowing operations

### Database Queries:
- Using Knex.js query builder
- All models extend base functionality
- Automatic timestamps (created_at, updated_at)

---

## Notes:
- CORS enabled for http://localhost:5173
- JWT expires in 7 days
- Database connection pooling enabled
- Error handling implemented for all endpoints
- Validation on required fields
