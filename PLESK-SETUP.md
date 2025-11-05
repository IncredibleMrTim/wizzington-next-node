# Plesk Configuration for Node.js App with PM2

## Overview

This application runs via PM2 (Node.js process manager), not directly through Plesk's Apache/Nginx. Plesk needs to proxy HTTP requests to your PM2 processes.

## IMPORTANT: Where Are My Files in Plesk?

**If you don't see files in Plesk File Manager, you're looking in the wrong place!**

Your files deploy to `/var/www/wizz-app/` (or your custom `DEPLOY_PATH`), **NOT** to `httpdocs/`.

### Finding Your Files in Plesk:

1. Open Plesk → **Files** → **File Manager**
2. By default, it opens to `httpdocs/` - **this is WRONG for Node.js apps**
3. Navigate to the path bar and type: `/var/www/wizz-app/`
4. You should see: `package.json`, `.next/`, `server/`, etc.

### Why Not httpdocs?

- **Static websites** (HTML/PHP): Use `httpdocs/` and are served by Apache/Nginx directly
- **Node.js with PM2** (this app): Uses `/var/www/wizz-app/` and runs independently via PM2
- Plesk's web server (Apache/Nginx) only proxies traffic to PM2 ports (3000/3001)
- Your app doesn't need to be in `httpdocs/` - it's not served as static files

## Architecture

```
Internet → Plesk (Apache/Nginx) → Proxy → PM2 Processes
                                           ├─ wizz-next (port 3000)
                                           └─ wizz-server (port 3001)
```

## Setup Steps

### 1. Verify Deployment Location

**Your deployment path should be:** `/var/www/wizz-app`

After pushing changes, check GitHub Actions logs to confirm where files are deployed:
- Go to: GitHub → Actions → Latest Deployment
- Look for "=== Deployment Information ===" section
- Verify the deployment path matches your `DEPLOY_PATH` secret (should be `/var/www/wizz-app`)

**Check your GitHub secret:**
- GitHub repo → Settings → Secrets → `DEPLOY_PATH`
- Value should be: `/var/www/wizz-app`

### 2. Verify Files Are Deployed

SSH into your server and check:

```bash
cd $DEPLOY_PATH  # Your deployment directory
ls -la
# You should see: package.json, .next/, server/, etc.
```

### 3. Check PM2 Processes

Verify PM2 processes are running:

```bash
pm2 list
# Should show: wizz-next and wizz-server
```

If not running:

```bash
cd $DEPLOY_PATH

# Start Next.js app
pm2 start yarn --name "wizz-next" -- start:next

# Start API server
pm2 start yarn --name "wizz-server" -- start:server

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 4. Configure Plesk Proxy

#### Option A: Using Plesk Node.js Extension (Recommended)

1. In Plesk, go to **Extensions** → Install **Node.js**
2. Go to **Websites & Domains** → Your domain → **Node.js**
3. Configure:
   - **Application Mode**: Production
   - **Application Root**: `/home/username/wizz-next-node`
   - **Application Startup File**: `server.js` or configure to use PM2
   - **Application URL**: Your domain

#### Option B: Manual Proxy Configuration

Create proxy rules in Plesk to forward traffic to PM2:

1. Go to **Websites & Domains** → Your domain → **Apache & Nginx Settings**
2. Add the following to **Additional directives for HTTP** (or HTTPS):

For **Nginx**:
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

For **Apache** (in Additional Apache directives):
```apache
ProxyPreserveHost On
ProxyPass /api http://localhost:3001
ProxyPassReverse /api http://localhost:3001

ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/

<Location />
    Order allow,deny
    Allow from all
</Location>
```

3. Click **OK** to apply changes

### 5. Verify Ports Are Correct

Check what ports your apps are using:

```bash
# Check Next.js port
pm2 show wizz-next

# Check server port
pm2 show wizz-server

# Verify ports are listening
netstat -tlnp | grep -E ':(3000|3001)'
```

### 6. Check Firewall

Ensure localhost ports are accessible (they should be by default):

```bash
# Ports 3000 and 3001 should be accessible from localhost
curl http://localhost:3000
curl http://localhost:3001
```

## Troubleshooting

### Files Not Visible in Plesk File Manager

**Issue**: Files are deployed but not visible in `httpdocs/`

**Solution**: Node.js apps don't go in `httpdocs/`. Check your deployment directory (usually `/home/username/` or a custom path).

### 502 Bad Gateway Error

**Issue**: Plesk can't connect to PM2 processes

**Solutions**:
1. Verify PM2 processes are running: `pm2 list`
2. Check ports are listening: `netstat -tlnp | grep node`
3. Check PM2 logs: `pm2 logs`
4. Restart processes: `pm2 restart all`

### Changes Not Appearing

**Issue**: Deployed but changes not visible

**Solutions**:
1. Clear Next.js cache: `rm -rf .next && yarn build`
2. Restart PM2: `pm2 restart all`
3. Clear browser cache

### Permission Issues

**Issue**: Deployment fails with permission errors

**Solutions**:
1. Verify SSH user has write access to deployment directory
2. Check ownership: `ls -la $DEPLOY_PATH`
3. Fix permissions: `chown -R username:username $DEPLOY_PATH`

## Environment Variables

Create `.env` file in your deployment directory with required variables:

```bash
cd $DEPLOY_PATH
nano .env
```

Add:
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_ADMIN_WHITE_LIST=admin@example.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

Restart PM2 after adding:
```bash
pm2 restart all
```

## Useful Commands

```bash
# Check PM2 status
pm2 list

# View logs
pm2 logs

# View specific app logs
pm2 logs wizz-next
pm2 logs wizz-server

# Restart apps
pm2 restart wizz-next
pm2 restart wizz-server

# Stop apps
pm2 stop all

# Delete apps from PM2
pm2 delete wizz-next
pm2 delete wizz-server

# Monitor resource usage
pm2 monit
```

## Next Steps

1. Push the updated workflow to trigger a new deployment
2. Check GitHub Actions logs for deployment path and verification
3. Configure Plesk proxy (Option A or B above)
4. Verify your domain serves the application
5. Test all functionality

## Support

If issues persist:
1. Share GitHub Actions deployment logs
2. Share PM2 status: `pm2 list`
3. Share Plesk error logs from **Logs** section
4. Share port status: `netstat -tlnp | grep node`
