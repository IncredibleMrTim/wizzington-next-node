#!/bin/bash

# Plesk Deployment Diagnostic Script
# Run this on your VPS to diagnose deployment issues

echo "=================================================="
echo "  Plesk/PM2 Deployment Diagnostic Tool"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as the correct user
echo "1. User Information:"
echo "   Current user: $(whoami)"
echo "   Home directory: $HOME"
echo ""

# Check deployment directory
echo "2. Deployment Directory:"
if [ -z "$DEPLOY_PATH" ]; then
    echo -e "${YELLOW}   ⚠ DEPLOY_PATH not set. Using current directory: $(pwd)${NC}"
    DEPLOY_PATH=$(pwd)
else
    echo "   DEPLOY_PATH: $DEPLOY_PATH"
fi

if [ -d "$DEPLOY_PATH" ]; then
    echo -e "${GREEN}   ✓ Directory exists${NC}"
    echo "   Contents:"
    ls -la "$DEPLOY_PATH" | head -n 10
else
    echo -e "${RED}   ✗ Directory does not exist${NC}"
fi
echo ""

# Check key files
echo "3. Checking Key Files:"
cd "$DEPLOY_PATH" 2>/dev/null || exit 1

files=("package.json" ".next" "server" "node_modules" ".env")
for file in "${files[@]}"; do
    if [ -e "$file" ]; then
        echo -e "${GREEN}   ✓ $file exists${NC}"
    else
        echo -e "${RED}   ✗ $file missing${NC}"
    fi
done
echo ""

# Check PM2
echo "4. PM2 Status:"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}   ✓ PM2 is installed${NC}"
    echo ""
    pm2 list
    echo ""
else
    echo -e "${RED}   ✗ PM2 not found${NC}"
    echo "   Install with: npm install -g pm2"
fi
echo ""

# Check ports
echo "5. Port Status:"
ports=(3000 3001)
for port in "${ports[@]}"; do
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        echo -e "${GREEN}   ✓ Port $port is in use${NC}"
        netstat -tlnp 2>/dev/null | grep ":$port "
    else
        echo -e "${RED}   ✗ Port $port is not listening${NC}"
    fi
done
echo ""

# Check localhost connectivity
echo "6. Localhost Connectivity:"
for port in "${ports[@]}"; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port | grep -q "200\|301\|302"; then
        echo -e "${GREEN}   ✓ http://localhost:$port is responding${NC}"
    else
        echo -e "${RED}   ✗ http://localhost:$port is not responding${NC}"
    fi
done
echo ""

# Check Node.js
echo "7. Node.js Environment:"
if command -v node &> /dev/null; then
    echo "   Node version: $(node -v)"
    echo "   npm version: $(npm -v)"
    if command -v yarn &> /dev/null; then
        echo "   Yarn version: $(yarn -v)"
    else
        echo -e "${YELLOW}   ⚠ Yarn not found${NC}"
    fi
else
    echo -e "${RED}   ✗ Node.js not found${NC}"
fi
echo ""

# Check environment variables
echo "8. Environment Variables:"
if [ -f ".env" ]; then
    echo -e "${GREEN}   ✓ .env file exists${NC}"
    echo "   Variables defined:"
    grep -v '^#' .env | grep -v '^$' | cut -d= -f1 | sed 's/^/      - /'
else
    echo -e "${YELLOW}   ⚠ .env file not found${NC}"
fi
echo ""

# Check logs
echo "9. Recent PM2 Logs (if available):"
if command -v pm2 &> /dev/null; then
    pm2 logs --nostream --lines 5
fi
echo ""

echo "=================================================="
echo "  Diagnostic Complete"
echo "=================================================="
echo ""
echo "Next Steps:"
echo "  1. Review any RED ✗ items above"
echo "  2. Ensure PM2 processes are running"
echo "  3. Configure Plesk proxy (see PLESK-SETUP.md)"
echo "  4. Check PM2 logs: pm2 logs"
echo ""
