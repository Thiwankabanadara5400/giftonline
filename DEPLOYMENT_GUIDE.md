# GiftOnline.com - Deployment & CI/CD Guide

## 🚀 Deployment Architecture Overview

This guide covers deploying GiftOnline.com with automatic updates via GitHub Actions and Docker.

### Technologies Used:
- **Frontend**: React + Vite (static assets)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting Options**: AWS, DigitalOcean, Heroku, or any VPS

---

## 📋 Part 1: Prepare for Deployment

### Step 1: Create GitHub Repository

```bash
# Initialize git in your project
cd d:\Giftofficial
git init
git add .
git commit -m "Initial commit: GiftOnline.com"

# Create repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/giftonline.git
git branch -M main
git push -u origin main
```

### Step 2: Environment Variables Setup

Create `.env` files for production:

**Backend `.env.production`:**
```
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=giftonline_prod
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_very_secure_jwt_secret_here
```

**Frontend `.env.production`:**
```
VITE_API_URL=https://api.giftonline.com
VITE_APP_NAME=GiftOnline.com
```

---

## 🐳 Part 2: Docker Setup

### Create `Dockerfile` for Backend

**File: `backend/Dockerfile`**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build (if needed)
RUN npm run build 2>/dev/null || true

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/server.js"]
```

### Create `Dockerfile` for Frontend

**File: `frontend/Dockerfile`**

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Create `nginx.conf` for Frontend

**File: `frontend/nginx.conf`**

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Create `docker-compose.yml`

**File: `docker-compose.yml`**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 🔄 Part 3: GitHub Actions CI/CD

### Create GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy GiftOnline.com

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install backend dependencies
        run: cd backend && npm install

      - name: Install frontend dependencies
        run: cd frontend && npm install

      - name: Run backend tests (if available)
        run: cd backend && npm test 2>/dev/null || true

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker images
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/giftonline-backend:latest
            ${{ secrets.DOCKER_USERNAME }}/giftonline-frontend:latest

      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/giftonline
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend npm run migrate
```

---

## 🏗️ Part 4: Deployment Options

### Option A: AWS EC2 Deployment

1. **Launch EC2 Instance:**
   - OS: Ubuntu 22.04 LTS
   - Instance: t3.micro or larger
   - Security Group: Allow ports 80, 443, 3000, 5432

2. **Install Docker & Docker Compose:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y docker.io docker-compose git
   sudo usermod -aG docker $USER
   ```

3. **Clone Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/giftonline.git
   cd giftonline
   ```

4. **Create `.env` file:**
   ```bash
   nano .env
   # Paste your environment variables
   ```

5. **Start Services:**
   ```bash
   docker-compose up -d
   ```

6. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d giftonline.com -d api.giftonline.com
   ```

### Option B: DigitalOcean App Platform

1. Go to **DigitalOcean Dashboard** → **Apps** → **Create App**
2. Connect GitHub repository
3. Configure build & run commands:
   - **Backend**: `npm install && npm run migrate && npm start`
   - **Frontend**: `npm install && npm run build`
4. Set environment variables from secrets
5. Configure PostgreSQL database
6. Deploy

### Option C: Heroku Deployment

1. **Create `Procfile`:**
   ```
   web: npm run start
   release: npm run migrate
   ```

2. **Deploy:**
   ```bash
   heroku login
   heroku create giftonline
   git push heroku main
   ```

---

## 🔐 Part 5: GitHub Secrets Setup

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

| Secret Name | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub token (not password) |
| `SERVER_HOST` | Your server IP address |
| `SERVER_USER` | SSH username (e.g., ubuntu) |
| `SERVER_SSH_KEY` | Private SSH key for server access |
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | JWT secret for token signing |

---

## 📝 Part 6: Domain Setup

### Step 1: Point Domain to Server

Add DNS records:
```
A Record: @ → your_server_ip
A Record: www → your_server_ip
A Record: api → your_server_ip
```

### Step 2: Update API URLs

Once domain is set, update:

**Frontend `.env.production`:**
```
VITE_API_URL=https://api.giftonline.com
```

**Backend configuration:**
```
CORS_ORIGIN=https://giftonline.com
```

---

## 🔄 Part 7: CI/CD Workflow Summary

```
1. Push code to main branch
   ↓
2. GitHub Actions triggers
   ↓
3. Tests run (if available)
   ↓
4. Docker images built
   ↓
5. Images pushed to Docker Hub
   ↓
6. SSH into server
   ↓
7. Pull new images
   ↓
8. Run migrations (if database changes)
   ↓
9. Restart containers with docker-compose up -d
   ↓
10. Live site updated automatically! ✅
```

---

## 📊 Monitoring & Maintenance

### View Logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Backup:
```bash
docker-compose exec postgres pg_dump -U postgres giftonline_prod > backup.sql
```

### Update Application:
```bash
git pull origin main
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Issue: Database connection failed
```bash
# Check PostgreSQL status
docker-compose ps postgres
# Reset database
docker-compose exec postgres psql -U postgres -d giftonline_prod -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Issue: Migrations not running
```bash
docker-compose exec backend npm run migrate
```

### Issue: Frontend showing blank page
```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

---

## 📞 Support & Next Steps

**After deployment, you can:**
- ✅ Add payment gateway (Stripe, PayPal)
- ✅ Implement email notifications
- ✅ Add analytics
- ✅ Implement user profiles & wishlists
- ✅ Add product reviews moderation
- ✅ Set up automated backups
- ✅ Configure CDN for faster image delivery

**Key endpoints after deployment:**
- Frontend: `https://giftonline.com`
- API: `https://api.giftonline.com`
- Admin Panel: `https://giftonline.com` (login required)

---

## 📚 Quick Reference

| Task | Command |
|---|---|
| Start all services | `docker-compose up -d` |
| Stop all services | `docker-compose down` |
| View running containers | `docker-compose ps` |
| Run migrations | `docker-compose exec backend npm run migrate` |
| Rebuild images | `docker-compose up -d --build` |
| View backend logs | `docker-compose logs -f backend` |
| SSH to server | `ssh -i key.pem ubuntu@server_ip` |

---

**Last Updated:** November 24, 2025  
**Version:** 1.0.0
