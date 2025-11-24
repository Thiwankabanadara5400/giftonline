# GitHub Secrets Setup Guide

This guide explains how to set up GitHub Secrets for the GiftOnline.com deployment pipeline.

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables stored in your GitHub repository. They're used in GitHub Actions workflows to securely pass sensitive information (passwords, API keys, SSH keys) without exposing them in your code.

## Required Secrets

Your GitHub Actions workflow requires the following secrets:

### 1. Docker Hub Credentials
- **DOCKER_USERNAME**: Your Docker Hub username
- **DOCKER_PASSWORD**: Your Docker Hub password or personal access token

### 2. Server Access
- **SERVER_HOST**: Your server's IP address or domain (e.g., `192.168.1.100` or `example.com`)
- **SERVER_USER**: SSH user account on your server (e.g., `deploy` or `ubuntu`)
- **SERVER_SSH_KEY**: Your SSH private key for server authentication

### 3. Database & Application
- **DB_PASSWORD**: PostgreSQL database password (should match your .env file)
- **JWT_SECRET**: JWT secret key for token signing (should match your .env file)

## How to Add Secrets to GitHub

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/Thiwankabanadara5400/giftonline`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Each Secret
Click **New repository secret** and enter each secret:

#### Docker Hub Setup
1. **DOCKER_USERNAME**
   - Value: Your Docker Hub username (e.g., `thiwankabanadara5400`)

2. **DOCKER_PASSWORD**
   - Value: Your Docker Hub password OR personal access token
   - To create a PAT: Go to docker.com → Account Settings → Security → New Access Token

#### Server Access Setup
3. **SERVER_HOST**
   - Value: Your server IP or domain (e.g., `203.0.113.45` or `giftonline.com`)

4. **SERVER_USER**
   - Value: The SSH user account on your server (usually `ubuntu`, `ec2-user`, or `deploy`)

5. **SERVER_SSH_KEY**
   - Value: Your SSH private key content (the full key from ~/.ssh/id_rsa)
   - To get your SSH key:
     ```powershell
     Get-Content ~/.ssh/id_rsa
     ```
   - Copy the entire content including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`

#### Application Configuration
6. **DB_PASSWORD**
   - Value: Same as `DB_PASSWORD` in your `.env` file

7. **JWT_SECRET**
   - Value: Same as `JWT_SECRET` in your `.env` file
   - Generate a secure random string if you don't have one:
     ```powershell
     -join ((33..126) | Get-Random -Count 32 | ForEach-Object {[char]$_})
     ```

## Verification Steps

After adding all secrets, verify they're correctly set:

1. In GitHub, go to **Settings** → **Secrets and variables** → **Actions**
2. You should see all 7 secrets listed (values are hidden)
3. Click each secret to confirm it's set (you won't see the value, but it should show "Updated X minutes ago")

## Testing the Workflow

After setting up secrets:

1. Make a small commit to the `main` branch
2. Go to **Actions** tab in your repository
3. Click on the **Build and Deploy** workflow
4. Click **Run workflow** → **Run workflow**
5. Monitor the workflow execution in real-time
6. Check the workflow logs to debug any issues

## Workflow Execution Flow

When you push code to `main` or manually trigger the workflow:

1. **Build & Push** (runs on `ubuntu-latest`)
   - Checks out your code
   - Builds Docker images for backend and frontend
   - Pushes images to Docker Hub

2. **Deploy** (runs after build succeeds)
   - Connects to your server via SSH
   - Pulls the latest images: `docker-compose pull`
   - Starts containers: `docker-compose up -d`
   - Runs database migrations: `docker-compose exec -T backend npm run migrate`
   - Verifies deployment with `docker ps`

## Troubleshooting

### "Docker login failed"
- Verify DOCKER_USERNAME and DOCKER_PASSWORD are correct
- Check if your Docker Hub account is active
- For PAT: ensure it has "Read & Write" permissions

### "SSH authentication failed"
- Verify SERVER_HOST is correct and reachable
- Check SERVER_USER matches the actual SSH user on your server
- Ensure SERVER_SSH_KEY is the private key (not public key)
- Verify the key has correct permissions on server: `chmod 600 ~/.ssh/authorized_keys`

### "Connection refused" to backend
- Ensure docker-compose services are running: `docker-compose ps`
- Check service logs: `docker-compose logs backend`
- Verify networking with: `docker network ls` and `docker network inspect giftonline`

### "Database connection failed"
- Check DB_PASSWORD matches in both .env and GitHub Secrets
- Verify PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`

## Local Testing Before Deployment

Before relying on GitHub Actions, test locally:

```powershell
# Build images locally
docker-compose build

# Start containers
docker-compose up -d

# Check all services running
docker-compose ps

# View logs
docker-compose logs -f backend

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:3000
```

## Security Best Practices

1. **Never commit secrets** - Always use GitHub Secrets
2. **Rotate SSH keys** - Change SERVER_SSH_KEY periodically
3. **Use SSH keys instead of passwords** - More secure for server access
4. **Limit Docker PAT permissions** - Use personal access tokens with minimal scope
5. **Monitor workflow runs** - Check Actions tab regularly for failed deployments
6. **Review logs carefully** - Never share logs containing sensitive info

## Next Steps

1. Add all 7 secrets to GitHub
2. Verify they're set correctly
3. Make a test commit to trigger the workflow
4. Monitor the deployment process
5. Access your application at your server's IP/domain

For detailed deployment instructions, see `DEPLOYMENT_GUIDE.md`.
