# 🎁 GiftOfficial - QUICK START REFERENCE

## 🚀 Start Backend (Terminal 1)

```bash
cd D:\Giftofficial\backend
npm install
npm run migrate
npm run dev
```

✅ **Backend Running**: http://localhost:5000
✅ **Health Check**: http://localhost:5000/api/health

---

## 🚀 Start Frontend (Terminal 2)

```bash
cd D:\Giftofficial\frontend
npm install
npm run dev
```

✅ **Frontend Running**: http://localhost:5173

---

## 🗄️ PostgreSQL Setup (One-time)

```sql
CREATE DATABASE giftonline_db;
CREATE USER giftonline_user WITH PASSWORD 'AzgR8$Zq';
GRANT ALL PRIVILEGES ON DATABASE giftonline_db TO giftonline_user;
```

---

## 📊 Project Structure

```
D:\Giftofficial\
├── backend/          (Node.js + Express.js)
│   └── PORT: 5000
├── frontend/         (React 18 + Vite)
│   └── PORT: 5173
└── Documentation files
```

---

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=giftonline_db
DB_USER=giftonline_user
DB_PASSWORD=AzgR8$Zq
JWT_SECRET=MWJmYjNhYTgtNDg1OC00MWQzLTk0MjMtYTkwY2NjMDQ5ZGM1MzFiYTdkYjMtNzFjOS00MmE2LTk3NTUtZjg5NWE0OGU3YzFm
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=GiftOfficial
```

---

## 📡 Key API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products (Admin)
PUT    /api/products/:id (Admin)
DELETE /api/products/:id (Admin)
```

### Categories
```
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories (Admin)
PUT    /api/categories/:id (Admin)
DELETE /api/categories/:id (Admin)
```

### Reviews
```
GET    /api/reviews
GET    /api/reviews/product/:productId
POST   /api/reviews (Auth)
PUT    /api/reviews/:id (Auth)
DELETE /api/reviews/:id (Auth)
```

---

## 🧪 Test Endpoints with Postman

### 1. Register User
```
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response includes token** - Copy for next requests

### 3. Get Products
```
GET http://localhost:5000/api/products
```

### 4. Create Product (Admin - Add Header)
```
POST http://localhost:5000/api/products
Header: Authorization: Bearer <token>
{
  "name": "Gift Card",
  "description": "Amazon Gift Card",
  "price": 50.00,
  "category_id": 1,
  "stock": 100,
  "image_url": "https://example.com/image.jpg"
}
```

---

## 🛠️ Useful Commands

### Backend
```bash
npm run dev              # Start dev server
npm run migrate          # Run migrations
npm run migrate:rollback # Rollback migrations
npm start              # Production mode
```

### Frontend
```bash
npm run dev             # Start dev server (5173)
npm run build           # Build for production
npm run preview         # Preview build
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check PostgreSQL running, verify .env, run `npm run migrate` |
| CORS error | Backend .env has correct CORS_ORIGIN |
| Token errors | Clear localStorage, login again |
| Database error | Ensure database and user exist |
| Port in use | Change PORT in .env or restart system |

---

## 📚 Documentation Files

1. **PROJECT_SETUP_GUIDE.md** - Initial setup
2. **IMPLEMENTATION_GUIDE.md** - Database & API docs
3. **BACKEND_COMPLETE.md** - Backend details
4. **FRONTEND_SETUP.md** - Frontend development
5. **COMPLETE_PROJECT_IMPLEMENTATION.md** - Full overview
6. **IMPLEMENTATION_STATUS.md** - Completion status
7. **QUICK_START.md** - This file

---

## ✅ What's Implemented

✅ Backend API (20+ endpoints)
✅ Database Schema (4 tables)
✅ Authentication System
✅ Admin Authorization
✅ Product Management
✅ Category Management
✅ Review System
✅ Frontend Structure
✅ API Service Layer
✅ Environment Configuration

---

## 📝 Frontend Development

### Add New Component
```bash
# Create in frontend/src/components/
touch ComponentName.jsx
```

### Add New Page
```bash
# Create in frontend/src/pages/
touch PageName.jsx
```

### Use API Service
```javascript
import { productService } from '../services/api.js';

const products = await productService.getAll();
```

### Use Custom Hook
```javascript
import { useAuth } from '../hooks/useAuth.js';

const { user, isAdmin, logout } = useAuth();
```

---

## 🔐 Login Credentials (After Registration)

After you register, use those credentials to login.

**Create Admin User:**
Manually update role in database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📱 Responsive Design

Frontend should work on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

---

## 🎨 Styling Approach

Use CSS with:
- Global styles in `index.css`
- Component styles in separate CSS files
- CSS variables for colors/sizing
- Flexbox for layouts

---

## 🚀 Deployment Checklist

- [ ] Backend: npm run build (if applicable)
- [ ] Frontend: npm run build
- [ ] Update production API URL
- [ ] Configure production database
- [ ] Set production environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Run migrations on production
- [ ] Test all features
- [ ] Setup monitoring/logging

---

## 💡 Next Steps

1. ✅ Setup PostgreSQL
2. ✅ Run Backend (`npm run dev`)
3. ✅ Run Frontend (`npm run dev`)
4. 📝 Build Components
5. 🧪 Test Features
6. 🚀 Deploy

---

## 📞 Support Resources

- Check documentation files
- Review error messages
- Check browser console for frontend errors
- Check terminal for backend errors
- Verify .env files
- Ensure all prerequisites installed

---

## 🎊 You're All Set!

Your GiftOfficial project is ready. Start both servers and begin development!

**Backend**: PORT 5000
**Frontend**: PORT 5173
**Database**: PostgreSQL giftonline_db

Happy Coding! 🎁
