# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- GitHub account with repository
- Server/VPS with Docker installed
- Domain name configured

## Security Checklist

✅ **Security Headers**: X-Content-Type-Options, X-Frame-Options, CSP, HSTS
✅ **Rate Limiting**: 60 requests per minute per IP
✅ **2FA**: TOTP-based two-factor authentication for admin
✅ **CORS**: Configured with allowed origins only
✅ **Password Hashing**: bcrypt with proper salt rounds
✅ **JWT**: Secure token-based authentication
✅ **Environment Variables**: All secrets in .env (not in code)
✅ **Docker**: Multi-stage builds, non-root user
✅ **Database**: PostgreSQL with health checks

## Environment Variables

### Backend (.env)

```env
# Database
POSTGRES_USER=skrynia_user
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=skrynia_db

# Security
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False

# Admin
ADMIN_EMAIL=dchuprina@lazysoft.pl
ADMIN_PASSWORD=<strong-password>

# URLs
FRONTEND_URL=https://runebox.eu
BACKEND_URL=https://api.runebox.eu

# Payment Gateways
STRIPE_SECRET_KEY=<stripe-secret>
STRIPE_PUBLIC_KEY=<stripe-public>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>

P24_MERCHANT_ID=<p24-merchant-id>
P24_POS_ID=<p24-pos-id>
P24_CRC=<p24-crc>
P24_API_KEY=<p24-api-key>
P24_TEST_MODE=False

# Email
MAIL_USERNAME=<email-username>
MAIL_PASSWORD=<email-password>
MAIL_FROM=runebox@lazysoft.pl
MAIL_SERVER=<smtp-server>
MAIL_PORT=587
MAIL_FROM_NAME=RuneBox

# CORS
ALLOWED_ORIGINS=["https://runebox.eu","https://www.runebox.eu"]
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.runebox.eu
NEXT_PUBLIC_SITE_URL=https://runebox.eu
```

## Deployment Steps

### 1. Build and Push Images

```bash
# Backend
cd skrynia/backend
docker build -t ghcr.io/your-org/skrynia/backend:latest .
docker push ghcr.io/your-org/skrynia/backend:latest

# Frontend
cd skrynia
docker build -t ghcr.io/your-org/skrynia/frontend:latest .
docker push ghcr.io/your-org/skrynia/frontend:latest
```

### 2. Deploy on Server

```bash
# Clone repository
git clone https://github.com/your-org/skrynia.git
cd skrynia

# Copy environment files
cp .env.example .env
cp skrynia/.env.local.example skrynia/.env.local

# Edit environment variables
nano .env
nano skrynia/.env.local

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Initialize database
docker-compose -f docker-compose.prod.yml exec backend python init_db.py
```

### 3. Setup 2FA for Admin

1. Login to admin panel
2. Go to Settings → Security
3. Click "Enable 2FA"
4. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
5. Enter verification code to enable

### 4. Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name runebox.eu www.runebox.eu;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name runebox.eu www.runebox.eu;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring

- Health check: `https://api.runebox.eu/health`
- API docs: `https://api.runebox.eu/api/docs`
- Database backups: Configure daily backups
- Logs: `docker-compose -f docker-compose.prod.yml logs -f`

## Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations if needed
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Security Notes

- Never commit .env files
- Use strong passwords (min 16 characters)
- Enable 2FA for admin account
- Regular security updates: `docker-compose -f docker-compose.prod.yml pull`
- Monitor logs for suspicious activity
- Use HTTPS only in production
- Regular database backups

