# GiftOfficial Frontend - Complete Setup Guide

## Frontend Status: Ready for Development

Frontend is configured and ready to run on **http://localhost:5173**

### Prerequisites
- Node.js v16+
- npm or yarn installed
- Backend running on http://localhost:5000

### Quick Start

```bash
cd D:\Giftofficial\frontend
npm install
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## Frontend Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Footer component
│   │   ├── ProductCard.jsx  # Product display card
│   │   ├── LoginForm.jsx    # Login form
│   │   ├── RegisterForm.jsx # Registration form
│   │   └── Navigation.jsx   # Navigation component
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx    # Home page
│   │   ├── ProductsPage.jsx # Products listing
│   │   ├── ProductDetailPage.jsx # Single product
│   │   ├── LoginPage.jsx   # Login page
│   │   ├── RegisterPage.jsx # Registration page
│   │   ├── AdminPage.jsx   # Admin dashboard
│   │   └── NotFoundPage.jsx # 404 page
│   ├── services/           # API services
│   │   ├── api.js         # Axios instance with interceptors
│   │   └── index.js       # API endpoints
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js     # Authentication hook
│   │   ├── useFetch.js    # Data fetching hook
│   │   └── useLocalStorage.js # LocalStorage hook
│   ├── context/           # Context API
│   │   └── AuthContext.jsx # Authentication context
│   ├── styles/            # CSS files
│   │   ├── App.css
│   │   ├── index.css
│   │   └── variables.css
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── .env                 # Environment variables
└── .env.example         # Example env file
```

---

## Environment Configuration

### .env File
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=GiftOfficial
```

---

## Key Components to Create

### 1. Pages
- **HomePage.jsx** - Welcome page with featured products
- **ProductsPage.jsx** - All products listing with filters
- **ProductDetailPage.jsx** - Single product details with reviews
- **LoginPage.jsx** - User login form
- **RegisterPage.jsx** - User registration form
- **AdminPage.jsx** - Admin dashboard for managing products/categories
- **NotFoundPage.jsx** - 404 error page

### 2. Components
- **Header.jsx** - Navigation and user info
- **Footer.jsx** - Footer information
- **ProductCard.jsx** - Reusable product card
- **LoginForm.jsx** - Login form component
- **RegisterForm.jsx** - Register form component
- **ReviewForm.jsx** - Submit review form
- **ReviewList.jsx** - Display reviews
- **LoadingSpinner.jsx** - Loading indicator
- **ErrorMessage.jsx** - Error display

### 3. Hooks
- **useAuth.js** - Authentication state management
- **useFetch.js** - Data fetching with loading/error states
- **useLocalStorage.js** - LocalStorage operations

### 4. Context
- **AuthContext.jsx** - Global authentication context

---

## API Integration Examples

### Login
```javascript
import { authAPI } from '../services/api.js';

const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    // Redirect to home
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Fetch Products
```javascript
import { useFetch } from '../hooks/useFetch.js';

function ProductsPage() {
  const { data: products, loading, error } = useFetch('/products');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Create Product (Admin)
```javascript
import { productsAPI } from '../services/api.js';

const handleCreateProduct = async (formData) => {
  try {
    const response = await productsAPI.createProduct(formData);
    console.log('Product created:', response.data);
  } catch (error) {
    console.error('Failed to create product:', error);
  }
};
```

### Create Review
```javascript
import { reviewsAPI } from '../services/api.js';

const handleCreateReview = async (productId, rating, comment) => {
  try {
    const response = await reviewsAPI.createReview({
      product_id: productId,
      user_id: currentUser.id,
      rating,
      comment
    });
    console.log('Review created:', response.data);
  } catch (error) {
    console.error('Failed to create review:', error);
  }
};
```

---

## Routing Setup (React Router v6)

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Authentication Flow

1. User registers with name, email, password
2. Token received and stored in localStorage as `authToken`
3. User info stored in localStorage as `user`
4. Token automatically added to all API requests via interceptor
5. If token invalid/expired, user redirected to login
6. Logout clears token and user data

---

## Styling Guidelines

### Global Styles (index.css)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### Component Styles (Component.css)
```css
.component-name {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.component-name:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

---

## Features to Implement

✅ User Authentication (Login/Register/Logout)
✅ Product Listing and Filtering
✅ Product Details with Reviews
✅ Add/Update/Delete Reviews (for logged-in users)
✅ Admin Dashboard (for admins only)
✅ Admin can Create/Update/Delete Products and Categories
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ Local Storage for Authentication

---

## npm scripts

```bash
npm run dev          # Start development server (PORT 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier (optional)
```

---

## Dependencies Already Installed

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Routing library
- **axios** - HTTP client
- **vite** - Build tool

---

## Development Workflow

1. **Create components** in `src/components/`
2. **Create pages** in `src/pages/`
3. **Use API services** from `src/services/`
4. **Implement custom hooks** in `src/hooks/`
5. **Style components** with CSS modules or inline styles
6. **Test locally** on http://localhost:5173
7. **Commit and push** to version control

---

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Ensure backend CORS is configured for http://localhost:5173

### Issue: Token not working
**Solution**: Verify token is saved in localStorage as 'authToken'

### Issue: API calls failing
**Solution**: Verify backend is running on http://localhost:5000

### Issue: Routes not working
**Solution**: Ensure React Router is properly configured

---

## Testing API Endpoints

### Using Frontend
The frontend automatically handles all API calls with authentication tokens

### Using Postman
1. Register a user via POST `/api/auth/register`
2. Copy the token from response
3. Add `Authorization: Bearer <token>` header to protected endpoints

### Using cURL
```bash
# Get all products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

---

## Deployment Considerations

- Build for production: `npm run build` creates `dist/` folder
- Deploy to Vercel, Netlify, or GitHub Pages
- Update VITE_API_URL to production backend URL
- Ensure backend CORS allows production domain

---

## Next Steps

1. ✅ Backend ready (see BACKEND_COMPLETE.md)
2. ⏳ Frontend development
3. ⏳ Connect frontend to backend
4. ⏳ Test all features
5. ⏳ Deploy both services

---

**Status**: Ready to develop
**Port**: 5173
**Backend Connection**: http://localhost:5000/api

Start developing by running:
```bash
npm install
npm run dev
```
