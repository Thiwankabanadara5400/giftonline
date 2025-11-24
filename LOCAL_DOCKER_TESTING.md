# Local Docker Testing Guide

This guide helps you test the GiftOnline.com application using Docker Compose locally before deployment.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- `.env` file configured with your settings

## Setup Steps

### Step 1: Create .env File

Copy `.env.example` to `.env` and update values:

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your local values:
```
DB_NAME=giftonline
DB_USER=admin
DB_PASSWORD=localpass123
DB_HOST=postgres
DB_PORT=5432
NODE_ENV=development
PORT=3000
JWT_SECRET=your_local_jwt_secret
CORS_ORIGIN=http://localhost
```

### Step 2: Build Images

```powershell
docker-compose build
```

This builds the backend and frontend Docker images locally.

### Step 3: Start Services

```powershell
docker-compose up -d
```

The `-d` flag runs services in background. This will:
- Start PostgreSQL container
- Wait for PostgreSQL to be healthy
- Start backend container (runs migrations automatically)
- Start frontend container

### Step 4: Verify All Services Running

```powershell
docker-compose ps
```

Expected output:
```
NAME                   COMMAND                  SERVICE      STATUS
giftonline-backend     "node src/server.js"     backend      Up (healthy)
giftonline-frontend    "nginx -g daemon off"    frontend     Up
giftonline-postgres    "postgres"               postgres     Up (healthy)
```

## Accessing the Application

- **Frontend**: http://localhost (or http://127.0.0.1)
- **Backend API**: http://localhost:3000
- **API Uploads**: http://localhost:3000/uploads/products/

## Useful Commands

### View Logs

View all service logs:
```powershell
docker-compose logs -f
```

View specific service logs:
```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Access Container Shell

```powershell
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U admin -d giftonline
```

### Check Service Health

```powershell
docker-compose ps
```

### Stop Services

```powershell
docker-compose stop
```

### Stop and Remove Containers (keeps volumes)

```powershell
docker-compose down
```

### Remove Everything (including database data)

```powershell
docker-compose down -v
```

### Rebuild and Restart

```powershell
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Testing the Application

### 1. Test User Registration

```powershell
$url = "http://localhost:3000/api/auth/register"
$body = @{
    email = "test@example.com"
    password = "Test123!"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
```

### 2. Test User Login

```powershell
$url = "http://localhost:3000/api/auth/login"
$body = @{
    email = "test@example.com"
    password = "Test123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
```

### 3. Test Admin Access

```powershell
# Register as regular user first, then promote in database
docker-compose exec postgres psql -U admin -d giftonline -c \
  "UPDATE users SET is_admin = true WHERE email = 'admin@example.com';"
```

### 4. Test Image Upload

```powershell
$token = "YOUR_JWT_TOKEN_HERE"

$form = @{
    image = (Get-Item "C:\path\to\image.jpg")
}

Invoke-RestMethod -Uri "http://localhost:3000/api/upload/upload" `
  -Method POST `
  -Form $form `
  -Headers @{Authorization = "Bearer $token"}
```

### 5. Test Product Creation

```powershell
$token = "YOUR_JWT_TOKEN_HERE"

$body = @{
    name = "Test Product"
    description = "Test Description"
    price = "29.99"
    category_id = 1
    affiliate_link = "https://example.com/product"
    images = @("image1.jpg", "image2.jpg")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -Headers @{Authorization = "Bearer $token"}
```

## Database Access

Connect directly to PostgreSQL:

```powershell
docker-compose exec postgres psql -U admin -d giftonline
```

Useful SQL queries:
```sql
-- List all users
SELECT * FROM users;

-- List all products
SELECT * FROM products;

-- List all categories
SELECT * FROM categories;

-- Make a user admin
UPDATE users SET is_admin = true WHERE email = 'email@example.com';

-- Check migrations
SELECT * FROM knex_migrations;
```

## File Uploads

Uploaded files are stored at `./backend/uploads/products/` and served via:
- `http://localhost:3000/uploads/products/filename.jpg`

To persist uploads between container restarts, the `docker-compose.yml` includes a volume mount.

## Common Issues

### Frontend shows "Cannot GET /"
- Wait 10-15 seconds for nginx to start
- Check frontend logs: `docker-compose logs frontend`
- Verify frontend container is running: `docker-compose ps`

### Backend returns "Connection refused"
- Wait for PostgreSQL to be healthy
- Check backend logs: `docker-compose logs backend`
- Verify migrations ran: `docker-compose logs backend | findstr migrate`

### Database connection failed
- Check DB_PASSWORD in .env matches docker-compose.yml
- Verify PostgreSQL is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`

### Image upload fails
- Verify file size < 5MB
- Verify file is image format (jpg, png, gif, webp)
- Check uploads directory exists: `ls backend/uploads/products/`

### Port already in use
- Change ports in docker-compose.yml:
  - Frontend: change port 80 to 8080
  - Backend: change port 3000 to 3001
  - PostgreSQL: change port 5432 to 5433

## Performance Tips

### Reduce Build Time
```powershell
docker-compose build --no-cache backend  # Only rebuild backend
```

### Monitor Resource Usage
```powershell
docker stats
```

### Clean Up Unused Resources
```powershell
docker system prune -a
```

## Next Steps

1. Start services with `docker-compose up -d`
2. Test the application at http://localhost
3. Create test users and products
4. Verify image uploads work
5. Check all endpoints in backend API
6. Review logs for any errors
7. When satisfied, push to GitHub to trigger automated deployment

## Documentation

- See `DEPLOYMENT_GUIDE.md` for production deployment
- See `GITHUB_SECRETS_SETUP.md` for CI/CD configuration
- See `README.md` for project overview
