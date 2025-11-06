#!/bin/bash

# Deployment script for VPS
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
        .
    print_status "Backup created: backup-$TIMESTAMP.tar.gz"
fi

# Navigate to app directory
cd "$APP_DIR"

# Pull latest changes
print_status "Pulling latest changes from git..."
git pull origin main || git pull origin master

# Install dependencies
print_status "Installing dependencies..."
yarn install --production

# Build application
print_status "Building Next.js application..."
yarn build

# Ensure uploads directory exists with correct permissions
if [ ! -d "$APP_DIR/uploads" ]; then
    print_status "Creating uploads directory..."
    mkdir -p "$APP_DIR/uploads"
fi
chmod 755 "$APP_DIR/uploads"

# Install systemd service if not already installed
if [ ! -f "/etc/systemd/system/wizz-next.service" ]; then
    print_status "Installing systemd service..."
    cp systemd/wizz-next.service /etc/systemd/system/
    mkdir -p /var/log/wizz-next
    chown $USER:$USER /var/log/wizz-next
    systemctl daemon-reload
    systemctl enable wizz-next
fi

# Restart application with systemd
print_status "Restarting application..."
systemctl restart wizz-next

# Wait for application to start
sleep 5

# Check application status
print_status "Checking application status..."
if systemctl is-active --quiet wizz-next; then
    print_status "Application is running!"
else
    print_error "Application failed to start!"
    print_warning "Rolling back to previous version..."

    # Rollback
    if [ -f "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz" ]; then
        cd "$APP_DIR"
        tar -xzf "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz"
        systemctl restart wizz-next
        print_error "Rolled back to previous version"
    fi
    exit 1
fi

# Clean up old backups (keep last 10)
print_status "Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t backup-*.tar.gz | tail -n +11 | xargs -r rm

# Test Next.js app
print_status "Testing application..."
if curl -s -f http://localhost:3000 > /dev/null; then
    print_status "Application is responding correctly"
else
    print_warning "Application health check failed"
fi

echo ""
print_status "Deployment completed successfully! 🎉"
echo ""
echo "Application Status:"
systemctl status wizz-next --no-pager

echo ""
echo "View logs with:"
echo "  sudo journalctl -u wizz-next -f"
echo "  sudo tail -f /var/log/wizz-next/output.log"
