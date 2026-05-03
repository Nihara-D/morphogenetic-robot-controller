# Deployment & Run Guide

**Morphogenetic Soft Robot Controller**  
**Author**: Nihara Dayarathne  
**Email**: shniharard@gmail.com

---

## Table of Contents

1. [Local Development](#local-development)
2. [Production Deployment](#production-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Server Configuration](#server-configuration)
5. [Troubleshooting](#troubleshooting)

---

## Local Development

### Initial Setup (One-Time)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/morphogenetic-robot-controller.git
cd morphogenetic-robot-controller

# 2. Install frontend dependencies
pnpm install

# 3. Install Python dependencies
cd python
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install packages
pip install --upgrade pip
pip install -r requirements.txt

# Return to project root
cd ..

# 4. Create .env.local file
cp .env.example .env.local
```

### Running Development Servers

#### Quick Start (Two Terminal Windows)

**Terminal 1 - Frontend (Port 3000)**:
```bash
cd morphogenetic-robot-controller
pnpm dev
```

**Terminal 2 - Backend (Port 5000)**:
```bash
cd morphogenetic-robot-controller/python

# Activate venv first
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  # Windows

python app.py
```

#### Expected Output

**Frontend**:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
✓ Compiled client and server successfully
```

**Backend**:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
 * Restarting with reloader
```

Visit: **http://localhost:3000**

---

## Production Deployment

### Build for Production

```bash
# 1. Build Next.js application
pnpm build

# 2. Verify build succeeded
pnpm start  # Test production build locally

# 3. In separate terminal, start Python backend
cd python
source venv/bin/activate  # or: venv\Scripts\activate
python app.py
```

### Deploy to Vercel (Recommended for Frontend)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy project
vercel

# 4. Follow prompts and configure environment variables
# Add to Vercel project settings:
# - PYTHON_API_URL = https://your-backend-domain.com

# 5. Set up custom domain (optional)
# Configure in Vercel dashboard
```

### Deploy Backend to Railway/Render/Heroku

#### Option A: Railway.app

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Add environment variables
railway variables set FLASK_ENV production FLASK_DEBUG false

# 5. Deploy
railway up
```

#### Option B: Render.com

```bash
# 1. Connect GitHub repository
# Go to: https://dashboard.render.com

# 2. Create new Web Service
# - Runtime: Python 3.9
# - Build Command: pip install -r requirements.txt
# - Start Command: python app.py
# - Environment: Add FLASK_ENV=production, FLASK_DEBUG=false

# 3. Deploy
# Renders automatically on git push
```

#### Option C: Heroku

```bash
# 1. Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Create Procfile
echo "web: cd python && python app.py" > Procfile

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

---

## Docker Deployment

### Using Docker Compose (Full Stack)

#### Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - PYTHON_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    build:
      context: ./python
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - FLASK_DEBUG=false
    volumes:
      - ./python:/app

volumes:
  python:
```

#### Create `Dockerfile.frontend`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

ARG PYTHON_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=$PYTHON_API_URL

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

#### Create `python/Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_ENV=production
ENV FLASK_DEBUG=false

EXPOSE 5000

CMD ["python", "app.py"]
```

#### Run with Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# In background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Server Configuration

### Environment Variables

#### `.env.local` (Development)

```env
# Backend API
PYTHON_API_URL=http://localhost:5000
PYTHON_PORT=5000

# Flask Configuration
FLASK_DEBUG=true
FLASK_ENV=development

# Simulation Settings
DEFAULT_NUM_STEPS=100
DEFAULT_DT=0.01
DEFAULT_GRID_SIZE=64
```

#### Production Environment (Vercel/Server)

```env
# Backend API (Production Domain)
PYTHON_API_URL=https://api.yourdomain.com
PYTHON_PORT=5000

# Flask Configuration
FLASK_DEBUG=false
FLASK_ENV=production

# Security
FLASK_SESSION_COOKIE_SECURE=true
FLASK_SESSION_COOKIE_HTTPONLY=true
FLASK_SESSION_COOKIE_SAMESITE=Lax

# CORS Settings (if needed)
FLASK_CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Simulation Settings
DEFAULT_NUM_STEPS=100
DEFAULT_DT=0.01
DEFAULT_GRID_SIZE=64
```

### System Requirements

| Component | Min Requirement | Recommended |
|-----------|-----------------|-------------|
| **Frontend** | Node 16 | Node 18+ |
| **Backend** | Python 3.8 | Python 3.9+ |
| **RAM** | 2GB | 4GB+ |
| **Storage** | 500MB | 2GB+ |
| **CPU** | 1 core | 2+ cores |

---

## Advanced Configuration

### Running with Process Manager (Production)

#### Using `pm2` (Node):

```bash
# 1. Install pm2 globally
npm install -g pm2

# 2. Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'morphogen-frontend',
      script: 'pnpm',
      args: 'start',
      cwd: './',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'morphogen-backend',
      script: 'python',
      args: 'app.py',
      cwd: './python',
      instances: 1,
      env: {
        FLASK_ENV: 'production',
        FLASK_DEBUG: 'false'
      }
    }
  ]
};
EOF

# 3. Start with pm2
pm2 start ecosystem.config.js

# 4. View status
pm2 status

# 5. View logs
pm2 logs

# 6. Stop/restart
pm2 restart all
pm2 stop all
```

#### Using `supervisor` (Python):

Create `/etc/supervisor/conf.d/morphogen.conf`:

```ini
[program:morphogen-backend]
command=/path/to/project/python/venv/bin/python /path/to/project/python/app.py
directory=/path/to/project/python
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/morphogen/backend.log
environment=FLASK_ENV=production,FLASK_DEBUG=false

[program:morphogen-frontend]
command=/usr/local/bin/pnpm start
directory=/path/to/project
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/morphogen/frontend.log
environment=NODE_ENV=production
```

### Nginx Reverse Proxy Configuration

```nginx
upstream morphogen_frontend {
    server 127.0.0.1:3000;
}

upstream morphogen_backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 100M;

    # Frontend
    location / {
        proxy_pass http://morphogen_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://morphogen_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSL (after installing certbot)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}
```

---

## Monitoring & Logs

### View Frontend Logs (Local Dev)

```bash
pnpm dev
# Logs print to terminal in real-time
```

### View Backend Logs (Local Dev)

```bash
cd python
source venv/bin/activate
python app.py
# Logs print to terminal in real-time
```

### Production Logging

#### Forward Logs to File

```bash
# Frontend
pnpm start >> /var/log/morphogen/frontend.log 2>&1 &

# Backend
cd python
source venv/bin/activate
python app.py >> /var/log/morphogen/backend.log 2>&1 &
```

#### Using `systemd` Service Files

Create `/etc/systemd/system/morphogen-backend.service`:

```ini
[Unit]
Description=Morphogenetic Robot Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/project/python
Environment="PATH=/path/to/project/python/venv/bin"
ExecStart=/path/to/project/python/venv/bin/python app.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable service
sudo systemctl enable morphogen-backend
sudo systemctl start morphogen-backend
sudo systemctl status morphogen-backend

# View logs
sudo journalctl -u morphogen-backend -f
```

---

## Troubleshooting

### Issue: Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000
# or on Windows:
# netstat -ano | findstr :3000

# Kill the process
kill -9 <PID>  # macOS/Linux
# or on Windows: taskkill /PID <PID> /F
```

### Issue: Virtual Environment Not Activating

```bash
# Verify venv exists
ls python/venv/bin/

# Recreate if needed
cd python
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Next.js Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
pnpm install
pnpm build

# Check for TypeScript errors
pnpm tsc --noEmit
```

### Issue: Python Dependencies Conflict

```bash
# Create fresh environment
cd python
rm -rf venv
python -m venv venv
source venv/bin/activate

# Upgrade pip first
pip install --upgrade pip setuptools wheel

# Install requirements
pip install -r requirements.txt

# Verify installation
pip list
```

### Issue: CORS Errors

Update backend `python/app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'http://localhost:3000',
    'http://localhost:8000',
    'https://yourdomain.com'
])
```

---

## Performance Optimization

### Frontend Optimization

```bash
# Use pnpm for faster installs
pnpm install

# Build with optimizations
pnpm build

# Analyze bundle size
pnpm build --analyze
```

### Backend Optimization

```bash
# Use JAX JIT compilation for faster PDE solving
# (Already enabled in morphogen_pde.py)

# Profile Flask app
pip install flask-debugtoolbar
# (Configure in app.py for development only)

# Scale with gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## Backup & Recovery

### Backup Experiment Data

```bash
# Backup database/logs
tar -czf morphogen-backup-$(date +%Y%m%d).tar.gz \
  python/logs/ \
  .env.local

# Store securely
mv morphogen-backup-*.tar.gz /backup/location/
```

### Restore from Backup

```bash
tar -xzf morphogen-backup-20260503.tar.gz
cd morphogen-robot-controller
pnpm install
cd python
pip install -r requirements.txt
```

---

## Support

**Author**: Nihara Dayarathne  
**Email**: shniharard@gmail.com

For deployment questions or issues, please reach out via email.

---

**Last Updated**: 2026-05-03
