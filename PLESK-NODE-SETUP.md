# Plesk Node.js Configuration Guide

This guide walks you through setting up your Next.js + Express monolith application on Plesk.

## Prerequisites

- Plesk Panel with Node.js extension installed
- MySQL database created in Plesk
- Domain configured in Plesk

## Step-by-Step Configuration

### 1. Create Node.js Application in Plesk

1. Go to **Websites & Domains** → Your Domain
2. Click **Node.js**
3. Click **Enable Node.js**

### 2. Configure Node.js Settings

Set the following in the Node.js configuration panel:

#### Application Settings:
- **Node.js version:** 20.x or higher
- **Application mode:** `production`
- **Document root:** `/httpdocs` (or your deployment path)
- **Application URL:** Your domain (e.g., `https://yourdomain.com`)

#### Application Startup:
- **Application startup file:** `start.js`
- **Custom startup command:** (leave empty, uses start.js directly)

#### Environment Variables:
Add these variables (click "+ Add Variable" for each):

```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=wizz_db
DB_PORT=3306
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_API_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_WHITE_LIST=your@email.com
SMTP_EMAIL=your_smtp_email
```

### 3. Install Dependencies

SSH into your server and run:

```bash
cd /var/www/vhosts/yourdomain.com/httpdocs
yarn install --production
cd server
yarn install --production
cd ..
```

### 4. Run Database Schema

Import your MySQL schema:

```bash
mysql -u your_mysql_user -p wizz_db < schema.sql
```

Or use phpMyAdmin:
1. Go to **Databases** → **phpMyAdmin**
2. Select your database
3. Click **Import**
4. Upload `schema.sql`

### 5. Configure Apache Proxy Rules

Since your app runs on two ports (3000 for Next.js, 3001 for API), you need to set up proxying.

#### Option A: Via Plesk Apache Settings

1. Go to **Apache & nginx Settings**
2. Add to **Additional directives for HTTP**:

```apache
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

#### Option B: Via .htaccess (if mod_proxy is enabled)

Create `.htaccess` in your document root:

```apache
<IfModule mod_proxy.c>
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</IfModule>
```

### 6. Start the Application

In Plesk Node.js panel:
1. Click **Restart App** or **NPM Install** to trigger a restart
2. Check **Logs** to verify both processes started successfully

You should see in the logs:
```
Starting Wizz application with PM2...
PM2 starting wizz-next on port 3000
PM2 starting wizz-server on port 3001
```

### 7. Verify Running Processes

SSH into your server and check PM2:

```bash
pm2 list
pm2 logs
```

You should see two processes running:
- `wizz-next` (port 3000)
- `wizz-server` (port 3001)

## Troubleshooting

### Application won't start

1. Check Node.js version: `node --version` (should be 20.x+)
2. Check logs in Plesk: **Node.js** → **Logs**
3. Check PM2 logs: `pm2 logs`
4. Verify permissions: `ls -la` in your app directory

### Database connection errors

1. Verify MySQL is running: `systemctl status mysql`
2. Test connection: `mysql -u your_user -p wizz_db`
3. Check environment variables in Plesk Node.js settings
4. Verify `server/.env` or root `.env` has correct credentials

### Port conflicts

If ports 3000/3001 are in use:

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :3001

# Kill if needed
kill -9 <PID>

# Restart your app in Plesk
```

### PM2 issues

Reset PM2:

```bash
pm2 kill
pm2 start ecosystem.config.js
pm2 save
```

## Updating Your Application

When you push new code via GitHub Actions:

1. The deployment script automatically:
   - Deploys new files
   - Runs `yarn install --production`
   - Restarts PM2 processes

2. Monitor deployment in GitHub Actions tab
3. Check Plesk logs if issues occur

## Manual Deployment

If deploying manually:

```bash
cd /var/www/vhosts/yourdomain.com/httpdocs
git pull origin main
yarn install --production
cd server && yarn install --production && cd ..
pm2 restart all
pm2 save
```

## Performance Tips

1. **Enable GZIP compression** in Apache settings
2. **Set up SSL** via Let's Encrypt in Plesk
3. **Configure caching** for static assets
4. **Monitor with PM2**: `pm2 monit`

## Support

- Check PM2 documentation: https://pm2.keymetrics.io/
- Plesk Node.js docs: https://docs.plesk.com/
- Application logs: `/var/www/vhosts/yourdomain.com/httpdocs/logs/`
