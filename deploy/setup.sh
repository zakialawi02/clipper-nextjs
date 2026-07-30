#!/bin/bash
# Production deployment helper for AI Clipper
# Usage: ./deploy/setup.sh

set -e

APP_DIR="/opt/clipper"
LOG_DIR="/var/log/clipper"
NODE_ENV="${NODE_ENV:-production}"

echo "🚀 AI Clipper Deployment Setup"
echo "================================"

# 1. Create directories
echo "📁 Creating directories..."
mkdir -p "$LOG_DIR"
mkdir -p "$APP_DIR"

# 2. Install dependencies
echo "📦 Installing dependencies..."
cd "$APP_DIR"
npm ci --production

# 3. Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# 4. Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# 5. Build Next.js
echo "🏗️  Building Next.js..."
npm run build

# 6. Setup PM2
echo "⚡ Setting up PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Stop existing if running
pm2 delete clipper-web clipper-worker 2>/dev/null || true

# Start the application
pm2 start ecosystem.config.cjs

# Save PM2 config for auto-start on reboot
pm2 save
pm2 startup | tail -1 | bash

# 7. Setup Nginx
echo "🌐 Setting up Nginx..."
if [ -f /etc/nginx/sites-available/clipper ]; then
    echo "Nginx config already exists, skipping..."
else
    cp deploy/nginx.conf /etc/nginx/sites-available/clipper
    ln -sf /etc/nginx/sites-available/clipper /etc/nginx/sites-enabled/clipper
    # Remove default site if present
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
fi

echo ""
echo "✅ Deployment complete!"
echo "   Web: http://localhost:3000 (internal)"
echo "   Health: curl http://localhost:3000/api/health"
echo "   PM2 status: pm2 status"
echo "   Logs: tail -f $LOG_DIR/*.log"
