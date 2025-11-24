# GiftOnline.com - Complete WSL Deployment Guide

This guide provides **step-by-step instructions for WSL users only** (no Docker Desktop needed). You'll deploy the entire application using Docker CLI in WSL.

## Prerequisites

- Windows 10/11 with WSL 2 installed
- Ubuntu or Debian distribution in WSL
- Docker installed in WSL (not Docker Desktop)
- Git configured
- Text editor (VS Code or nano)

## Step 1: Install Docker in WSL

### 1.1 Update WSL System
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Docker
```bash
# Install Docker repository
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 1.3 Configure Docker Daemon (Run without sudo)
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Apply group changes (choose one method):
# Method 1: Log out and back in, or
# Method 2: Run this command
newgrp docker

# Verify (should work without sudo)
docker ps
```

### 1.4 Start Docker Service
```bash
# Start Docker
sudo service docker start

# Enable on boot (optional, check if your WSL distro supports it)
sudo systemctl enable docker

# Verify Docker is running
docker info
```

## Step 2: Clone Repository in WSL

```bash
# Navigate to home directory or desired location
cd ~

# Clone your repository
git clone https://github.com/Thiwankabanadara5400/giftonline.git
cd giftonline

# Verify files are present
ls -la
```

## Step 3: Create .env File

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your values
nano .env
```

**Paste this content** (or edit with nano):
```
PORT=3000
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_NAME=giftonline_db
DB_USER=giftonline_user
DB_PASSWORD=AzgR8$Zq
JWT_SECRET=MWJmYjNhYTgtNDg1OC00MWQzLTk0MjMtYTkwY2NjMDQ5ZGM1MzFiYTdkYjMtNzFjOS00MmE2LTk3NTUtZjg5NWE0OGU3YzFm
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
API_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=GiftOnline.com
```

**To save in nano**: Press `Ctrl+O`, Enter, then `Ctrl+X`

## Step 4: Start the Application with Docker Compose

### 4.1 Build Docker Images
```bash
# Build all images (backend, frontend, postgres)
docker compose build
```

**Expected output:**
```
[+] Building 45.2s (14/14) FINISHED
...
=> exporting to image
=> => exporting layers
=> => writing image sha256:...
```

### 4.2 Start Services
```bash
# Start all containers in background
docker compose up -d

# Wait 10-15 seconds for services to start
sleep 15

# Check status
docker compose ps
```

**Expected output:**
```
NAME                   STATUS              PORTS
giftonline-db          Up (healthy)        5432/tcp
giftonline-backend     Up                  0.0.0.0:3000->3000/tcp
giftonline-frontend    Up                  0.0.0.0:80->80/tcp
```

### 4.3 Verify Services are Running
```bash
# Check all services
docker compose ps

# View logs to ensure no errors
docker compose logs

# View specific service logs
docker compose logs backend
docker compose logs frontend
docker compose logs postgres
```

## Step 5: Access the Application

Once services are running, access at:

- **Frontend**: http://localhost (or http://127.0.0.1)
- **Backend API**: http://localhost:3000
- **API Docs** (if available): http://localhost:3000/api/docs

### Test in Browser
```bash
# From Windows command prompt or PowerShell, open browser
start http://localhost
```

### Test from WSL Terminal
```bash
# Test frontend
curl http://localhost

# Test backend
curl http://localhost:3000/api/health

# Test database connection
docker compose exec postgres psql -U giftonline_user -d giftonline_db -c "SELECT version();"
```

## Step 6: Database Management

### 6.1 Access PostgreSQL
```bash
# Connect to database
docker compose exec postgres psql -U giftonline_user -d giftonline_db

# Useful commands in psql:
# \dt              - List all tables
# \du              - List users
# SELECT * FROM users;  - View users table
# \q              - Exit psql
```

### 6.2 View Database Logs
```bash
docker compose logs postgres
```

### 6.3 Reset Database (if needed)
```bash
# Stop services
docker compose down

# Remove volume
docker volume rm giftonline_postgres_data

# Restart
docker compose up -d

# Wait for migrations
sleep 20
```

## Step 7: Useful Docker Compose Commands

### View Logs
```bash
# All logs
docker compose logs -f

# Last 50 lines
docker compose logs -f --tail=50

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Execute Commands in Container
```bash
# Run command in backend container
docker compose exec backend npm run migrate

# Run command in database
docker compose exec postgres psql -U giftonline_user -d giftonline_db

# Access bash in backend
docker compose exec backend sh
```

### Stop/Start Services
```bash
# Stop all services (keeps data)
docker compose stop

# Start services
docker compose start

# Restart a service
docker compose restart backend

# Stop and remove containers (keeps volumes/data)
docker compose down

# Stop and remove everything including volumes
docker compose down -v
```

### View Resource Usage
```bash
# Check container stats
docker stats

# Check disk usage
docker system df

# Clean up unused resources
docker system prune
```

## Step 8: API Testing

### 8.1 Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

### 8.2 Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 8.3 Create Category
```bash
# First get JWT token from login response, then:
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Electronics",
    "description": "Electronic gifts"
  }'
```

### 8.4 Upload Image
```bash
# Upload image file
curl -X POST http://localhost:3000/api/upload/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### 8.5 Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 29.99,
    "category_id": 1,
    "affiliate_link": "https://example.com/product",
    "images": ["image1.jpg", "image2.jpg"]
  }'
```

## Step 9: Troubleshooting

### Docker Service Not Running
```bash
# Check if Docker is running
docker ps

# If error "Cannot connect to Docker daemon":
sudo service docker start

# Verify
docker ps
```

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Find process using port 80
sudo lsof -i :80

# Kill process (replace PID)
kill -9 <PID>
```

### Container Startup Fails
```bash
# View detailed logs
docker compose logs backend

# Check environment variables in container
docker compose exec backend sh
# Inside container: echo $DB_HOST

# Check .env file
cat .env
```

### Database Connection Failed
```bash
# Test database manually
docker compose exec postgres psql -U giftonline_user -d giftonline_db -c "SELECT 1;"

# Check database logs
docker compose logs postgres

# Verify credentials in .env
grep DB_ .env
```

### Build Fails
```bash
# Clean rebuild
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Step 10: Production Deployment (Optional)

When ready to deploy to production server:

### 10.1 Push to GitHub
```bash
git add .
git commit -m "Update docker-compose for WSL deployment"
git push origin main
```

### 10.2 GitHub Secrets Setup
Add these secrets to GitHub repository (Settings → Secrets):
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password
- `SERVER_HOST`: Your production server IP
- `SERVER_USER`: SSH user on production server
- `SERVER_SSH_KEY`: Your SSH private key
- `DB_PASSWORD`: Same as in .env
- `JWT_SECRET`: Same as in .env

### 10.3 Deploy to Server
```bash
# On your production server (with Docker installed):
git clone https://github.com/Thiwankabanadara5400/giftonline.git
cd giftonline
cp .env.example .env
# Edit .env with production values
nano .env
docker compose up -d
```

## Step 11: Monitoring & Maintenance

### 11.1 Monitor Logs in Real-time
```bash
# Watch all logs
docker compose logs -f

# Watch backend only with timestamps
docker compose logs -f --timestamps backend
```

### 11.2 View Container Health
```bash
# Check health status
docker compose ps

# Inspect database health specifically
docker inspect giftonline-db | grep -A 10 Health
```

### 11.3 Backup Database
```bash
# Backup PostgreSQL
docker compose exec postgres pg_dump -U giftonline_user giftonline_db > backup.sql

# Restore backup
docker compose exec -T postgres psql -U giftonline_user giftonline_db < backup.sql
```

### 11.4 View Disk Usage
```bash
# Docker system usage
docker system df

# Specific volume usage
docker volume inspect giftonline_postgres_data

# Container size
docker compose ps -a
```

## Step 12: Useful Links & Resources

### Docker Documentation
- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Docker CLI Commands](https://docs.docker.com/engine/reference/commandline/cli/)

### WSL & Development
- [WSL Official Docs](https://learn.microsoft.com/en-us/windows/wsl/)
- [WSL Docker Setup](https://docs.docker.com/desktop/wsl/)
- [VS Code WSL Extension](https://code.visualstudio.com/docs/remote/wsl)

### PostgreSQL
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [PostgreSQL CLI Commands](https://www.postgresql.org/docs/current/reference-client.html)

### Node.js & Express
- [Node.js Official](https://nodejs.org/)
- [Express.js Docs](https://expressjs.com/)
- [NPM Registry](https://www.npmjs.com/)

### React & Frontend
- [React Official Docs](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## Quick Reference Commands

```bash
# Start application
docker compose up -d

# Stop application
docker compose down

# View logs
docker compose logs -f

# Execute command in container
docker compose exec backend <command>

# Rebuild images
docker compose build

# See running containers
docker compose ps

# Remove all (including data)
docker compose down -v

# Connect to database
docker compose exec postgres psql -U giftonline_user -d giftonline_db

# Restart a service
docker compose restart backend

# View resource usage
docker stats
```

## Support & Troubleshooting

If you encounter issues:

1. **Check logs first**: `docker compose logs -f`
2. **Verify .env file**: `cat .env`
3. **Check if ports are available**: `lsof -i :3000` and `lsof -i :80`
4. **Rebuild from scratch**: `docker compose down -v && docker compose build --no-cache && docker compose up -d`
5. **Check Docker daemon**: `docker ps`

For more help, refer to:
- [LOCAL_DOCKER_TESTING.md](./LOCAL_DOCKER_TESTING.md) - Detailed testing guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) - CI/CD configuration

---

**Last Updated**: November 24, 2025
**For**: GiftOnline.com WSL Deployment
