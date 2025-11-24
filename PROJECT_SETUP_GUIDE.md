# React Project Setup Guide - Frontend & Backend

## Project Overview
This document outlines the complete structure and setup process for a React project with separate frontend and backend components.

---

## 1. Project Structure

```
project-root/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service calls
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Global styles/CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.js       # Vite configuration
│   └── .env.local           # Environment variables
│
├── backend/                  # Node.js/Express API server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/      # Request handlers
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration files
│   │   └── index.js         # Server entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

---

## 2. Frontend Setup

### 2.1 Technologies
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: CSS3 / Tailwind CSS / Styled Components (optional)
- **HTTP Client**: Axios / Fetch API
- **State Management**: Redux / Context API / Zustand (optional)
- **Routing**: React Router

### 2.2 Key Files Structure

#### `frontend/src/App.jsx`
Main application component with routing

#### `frontend/src/services/api.js`
Centralized API service for all backend calls
```
- Configure base URL
- Handle authentication tokens
- Setup request/response interceptors
```

#### `frontend/src/components/`
Reusable UI components
```
- Header.jsx
- Navigation.jsx
- Footer.jsx
- Card.jsx
- Modal.jsx
- etc.
```

#### `frontend/src/pages/`
Page-level components for different routes
```
- HomePage.jsx
- LoginPage.jsx
- DashboardPage.jsx
- ProfilePage.jsx
- NotFoundPage.jsx
```

#### `frontend/src/hooks/`
Custom React hooks
```
- useAuth.js
- useFetch.js
- useLocalStorage.js
```

#### `frontend/src/utils/`
Helper functions
```
- validators.js
- formatters.js
- constants.js
```

### 2.3 Environment Variables
`frontend/.env.local`
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=My React App
```

---

## 3. Backend Setup

### 3.1 Technologies
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB / PostgreSQL / MySQL
- **ODM/ORM**: Mongoose / Sequelize / Prisma
- **Authentication**: JWT / OAuth
- **Validation**: Joi / Yup / Express Validator
- **Logging**: Winston / Morgan

### 3.2 Key Files Structure

#### `backend/src/index.js`
Server entry point
```
- Initialize Express app
- Setup middleware
- Connect to database
- Define routes
- Error handling
- Server listen
```

#### `backend/src/routes/`
API route definitions
```
- users.routes.js
- products.routes.js
- orders.routes.js
- auth.routes.js
```

#### `backend/src/controllers/`
Request handlers and business logic
```
- userController.js
- productController.js
- orderController.js
- authController.js
```

#### `backend/src/models/`
Database schema/models
```
- User.model.js
- Product.model.js
- Order.model.js
```

#### `backend/src/middleware/`
Custom middleware functions
```
- auth.middleware.js      # JWT verification
- errorHandler.js         # Global error handling
- validation.js           # Request validation
- corsHandler.js          # CORS configuration
```

#### `backend/src/utils/`
Helper functions
```
- responseFormatter.js
- validators.js
- errorHandler.js
```

#### `backend/src/config/`
Configuration files
```
- database.js             # Database connection
- environment.js          # Environment config
- constants.js            # App constants
```

### 3.3 Environment Variables
`backend/.env`
```
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

---

## 4. API Communication

### 4.1 Base URL Configuration
Frontend connects to Backend at:
```
Frontend: http://localhost:5173 (Vite default)
Backend: http://localhost:5000 (Express default)
```

### 4.2 CORS Setup
Backend must enable CORS to accept requests from frontend:
```
- Configure allowed origins
- Setup credentials headers
- Define allowed methods (GET, POST, PUT, DELETE, etc.)
```

### 4.3 API Endpoints Example
```
GET    /api/users           - Get all users
GET    /api/users/:id       - Get single user
POST   /api/users           - Create user
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
POST   /api/auth/login      - User login
POST   /api/auth/register   - User registration
POST   /api/auth/logout     - User logout
```

---

## 5. Authentication Flow

### 5.1 JWT Token Flow
1. User submits credentials to login endpoint
2. Backend validates and generates JWT token
3. Frontend stores token (localStorage/sessionStorage)
4. Frontend includes token in request headers (Authorization: Bearer {token})
5. Backend validates token on protected routes
6. Server returns data or 401 Unauthorized

### 5.2 Protected Routes (Frontend)
- Private route wrapper component
- Checks authentication status
- Redirects to login if not authenticated

### 5.3 Protected Routes (Backend)
- Middleware to verify JWT
- Checks token validity and expiration
- Attaches user info to request object

---

## 6. Development Workflow

### 6.1 Running Frontend
```bash
cd frontend
npm run dev
# Access at http://localhost:5173
```

### 6.2 Running Backend
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

### 6.3 Database Setup
- Configure connection string in `.env`
- Run migrations/seed scripts
- Initialize models/schemas

---

## 7. Deployment Structure

### 7.1 Frontend Deployment
- Build: `npm run build` → Creates dist folder
- Hosting: Vercel / Netlify / GitHub Pages
- Environment: Production API URL configuration

### 7.2 Backend Deployment
- Platform: Heroku / Railway / AWS / Azure / DigitalOcean
- Database: Cloud MongoDB Atlas / Managed PostgreSQL
- Environment variables properly configured
- CORS settings for production domain

### 7.3 Deployment URLs Example
```
Frontend: https://app.example.com
Backend: https://api.example.com
```

---

## 8. Development Tools & Setup

### 8.1 Frontend Dependencies
- react
- react-dom
- react-router-dom
- axios
- vite (build tool)
- eslint
- prettier (optional)

### 8.2 Backend Dependencies
- express
- mongoose/sequelize/prisma (based on DB choice)
- dotenv
- cors
- jsonwebtoken
- bcryptjs (password hashing)
- joi/yup (validation)
- nodemon (development)

### 8.3 Development Tools
- Git/GitHub for version control
- VSCode as code editor
- Postman/Insomnia for API testing
- MongoDB Compass (if using MongoDB)
- DBeaver (if using PostgreSQL/MySQL)

---

## 9. Git Repository Structure

### 9.1 Repository Setup
```
Main branch for production
Develop branch for development
Feature branches for new features (feature/feature-name)
Bugfix branches for fixes (bugfix/bug-name)
```

### 9.2 .gitignore Configuration
```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
```

---

## 10. Common API Response Format

### 10.1 Success Response
```json
{
  "success": true,
  "status": 200,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 10.2 Error Response
```json
{
  "success": false,
  "status": 400,
  "message": "Validation error",
  "errors": {
    "email": "Invalid email format"
  }
}
```

---

## 11. Testing Strategy

### 11.1 Frontend Testing
- Unit tests: Jest + React Testing Library
- Integration tests: Cypress / Playwright
- E2E tests: Cypress / Selenium

### 11.2 Backend Testing
- Unit tests: Jest / Mocha
- Integration tests: Supertest
- API tests: Postman collections

---

## 12. Documentation Files Needed

### 12.1 Frontend Documentation
- `frontend/README.md` - Setup and run instructions
- `frontend/API.md` - Available API endpoints
- `frontend/COMPONENTS.md` - Component documentation

### 12.2 Backend Documentation
- `backend/README.md` - Setup and run instructions
- `backend/API.md` - Detailed API endpoints documentation
- `backend/DATABASE.md` - Database schema documentation

### 12.3 Root Documentation
- `README.md` - Project overview and getting started
- `.env.example` files - Template environment variables

---

## 13. Getting Started - Step by Step Commands

### 13.1 Prerequisites
- Node.js (v16 or higher) - Download from nodejs.org
- PostgreSQL installed and running
- Git installed
- Code editor (VSCode recommended)

### 13.2 Initial Setup

#### Step 1: Create Project Folder
```bash
mkdir my-react-app
cd my-react-app
```

#### Step 2: Initialize Git Repository
```bash
git init
```

#### Step 3: Create Frontend with Vite + React
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
cd ..
```

This creates the frontend with `.jsx` files structure.

#### Step 4: Create Backend with Node.js + Express
```bash
mkdir backend
cd backend
npm init -y
```

#### Step 5: Install Backend Dependencies (PostgreSQL)
```bash
npm install express cors dotenv pg sequelize bcryptjs jsonwebtoken joi morgan
npm install --save-dev nodemon
cd ..
```

---

### 13.3 Frontend File Structure (.jsx files)

#### Create Frontend Folders
```bash
cd frontend
mkdir -p src/components src/pages src/hooks src/services src/utils src/styles
```

#### Frontend Files to Create:

**src/main.jsx** - Entry point
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**src/App.jsx** - Main component
```jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <h1>Welcome to React</h1>
    </div>
  )
}

export default App
```

**src/services/api.js** - API service
```js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

**src/components/Header.jsx** - Header component
```jsx
export default function Header() {
  return (
    <header>
      <h1>My App</h1>
    </header>
  )
}
```

**src/pages/HomePage.jsx** - Home page
```jsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome Home</h1>
    </div>
  )
}
```

**src/utils/constants.js** - Constants file
```js
export const API_BASE_URL = 'http://localhost:5000/api'
export const APP_NAME = 'My React App'
```

**src/hooks/useAuth.js** - Custom hook
```js
import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token logic here
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  return { user, loading }
}
```

#### Create .env.local for Frontend
```bash
cd frontend
```

**frontend/.env.local**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Gift App
VITE_ENV=development
```

---

### 13.4 Backend File Structure (.js files)

#### Create Backend Folders
```bash
cd backend
mkdir -p src/routes src/controllers src/models src/middleware src/config src/utils
touch src/index.js .env .gitignore
```

#### Backend Files to Create:

**backend/src/index.js** - Server entry point
```js
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}))
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

**backend/src/config/database.js** - Database connection
```js
const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
)

module.exports = sequelize
```

**backend/src/models/User.model.js** - User model
```js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = User
```

**backend/src/controllers/userController.js** - User controller
```js
const User = require('../models/User.model')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    res.json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
```

**backend/src/routes/users.routes.js** - User routes
```js
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)

module.exports = router
```

**backend/src/middleware/auth.middleware.js** - Auth middleware
```js
const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
```

**backend/src/utils/validators.js** - Validators
```js
const Joi = require('joi')

exports.validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(user)
}

exports.validateEmail = (email) => {
  const schema = Joi.string().email().required()
  return schema.validate(email)
}
```

#### Create .env for Backend
**backend/.env**
```
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gift_app
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Create .gitignore for Backend
**backend/.gitignore**
```
node_modules/
.env
.env.local
dist/
build/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
```

---

### 13.5 PostgreSQL Database Setup

#### Step 1: Create PostgreSQL Database
```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE gift_app;

# Create user (if not exists)
CREATE USER postgres_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE gift_app TO postgres_user;

# Exit
\q
```

#### Step 2: Run Migrations (using Sequelize)
In backend folder:
```bash
cd backend
npm install sequelize-cli --save-dev
npx sequelize-cli init
```

---

### 13.6 Running the Application

#### Terminal 1: Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:5173
```

#### Terminal 2: Start Backend
```bash
cd backend
npm run dev
# Backend runs at http://localhost:5000
```

Or use single commands:

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
npm start
# or
node src/index.js
```

---

### 13.7 Frontend package.json Scripts
Add to `frontend/package.json`:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .jsx,.js"
}
```

---

### 13.8 Backend package.json Scripts
Add to `backend/package.json`:
```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "test": "jest"
}
```

---

### 13.9 Testing API Endpoints

#### Using cURL (Command line)
```bash
# Get all users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'
```

#### Using Postman
1. Download Postman from postman.com
2. Create new request
3. Set method to GET/POST/PUT/DELETE
4. Enter URL: http://localhost:5000/api/users
5. Click Send

---

## 14. Next Steps

1. Initialize frontend with Vite + React
2. Initialize backend with Node.js + Express
3. Setup PostgreSQL database
4. Create authentication system
5. Develop API endpoints
6. Build frontend components and pages
7. Integrate frontend with backend API
8. Setup testing
9. Configure deployment
10. Deploy to production

---

## 14. Useful Commands Reference

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Backend
```bash
npm run dev          # Start dev server with nodemon
npm run start        # Start production server
npm run seed         # Seed database
npm run migrate      # Run migrations
npm test             # Run tests
```

---

**Document Version**: 1.0  
**Last Updated**: November 23, 2025  
**Status**: Ready for implementation
