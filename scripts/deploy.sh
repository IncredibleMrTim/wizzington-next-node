#!/bin/bash

# Deployment script for Fasthosts VPS
# This script should be run on the VPS server

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Configuration
APP_DIR="/var/www/wizz-app"
BACKUP_DIR="/var/backups/wizz-app"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "Please run with sudo or as root"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup current deployment
if [ -d "$APP_DIR" ]; then
    print_status "Creating backup of current deployment..."
    tar -czf "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz" \
        -C "$APP_DIR" \
        --exclude=node_modules \
        --exclude=.next \
        --exclude=uploads \
        --exclude=dist \
        .
    print_status "Backup created: backup-$TIMESTAMP.tar.gz"
fi

# Navigate to app directory
cd "$APP_DIR"

# Pull latest changes
print_status "Pulling latest changes from git..."
git pull origin main || git pull origin master

# Install dependencies
print_status "Installing Next.js dependencies..."
yarn install --production

print_status "Installing server dependencies..."
cd server
yarn install --production
cd ..

# Build applications
print_status "Building Next.js application..."
yarn build

print_status "Building server..."
cd server
yarn build
cd ..

# Ensure uploads directory exists with correct permissions
if [ ! -d "$APP_DIR/uploads" ]; then
    print_status "Creating uploads directory..."
    mkdir -p "$APP_DIR/uploads"
fi
chmod 755 "$APP_DIR/uploads"

# Restart applications with PM2
print_status "Restarting applications..."
pm2 restart wizz-next
pm2 restart wizz-server
pm2 save

# Wait for applications to start
sleep 5

# Check application status
print_status "Checking application status..."
if pm2 describe wizz-next | grep -q "online" && pm2 describe wizz-server | grep -q "online"; then
    print_status "Both applications are running!"
else
    print_error "One or more applications failed to start!"
    print_warning "Rolling back to previous version..."

    # Rollback
    if [ -f "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz" ]; then
        cd "$APP_DIR"
        tar -xzf "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz"
        pm2 restart all
        print_error "Rolled back to previous version"
    fi
    exit 1
fi

# Clean up old backups (keep last 10)
print_status "Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t backup-*.tar.gz | tail -n +11 | xargs -r rm

# Test API endpoint
print_status "Testing API endpoint..."
if curl -s -f http://localhost:4000/api/health > /dev/null; then
    print_status "API is responding correctly"
else
    print_warning "API health check failed"
fi

# Test Next.js app
print_status "Testing Next.js application..."
if curl -s -f http://localhost:3000 > /dev/null; then
    print_status "Next.js app is responding correctly"
else
    print_warning "Next.js health check failed"
fi

echo ""
print_status "Deployment completed successfully! 🎉"
echo ""
echo "Application Status:"
pm2 status

echo ""
echo "View logs with:"
echo "  pm2 logs wizz-next"
echo "  pm2 logs wizz-server"
