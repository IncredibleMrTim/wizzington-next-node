# Fasthosts VPS Deployment Guide

This guide will help you deploy your Next.js application and Node.js server to a Fasthosts VPS.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Manual Deployment](#manual-deployment)
- [CI/CD Setup with GitHub Actions](#cicd-setup-with-github-actions)
- [Maintenance](#maintenance-commands)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- A Fasthosts VPS with Ubuntu/Debian
- SSH access to your VPS
- A domain name pointed to your VPS IP address
- Node.js 18+ installed on the VPS
- GitHub account (for CI/CD setup)

---

# Manual Deployment

## Step 1: Initial VPS Setup

### Connect to your VPS via SSH

```bash
ssh root@your-vps-ip
```

### Update system packages

```bash
apt update && apt upgrade -y
```

### Install Node.js 20.x (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### Install Yarn (if not already installed)

```bash
npm install -g yarn
```

### Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### Install Nginx

```bash
apt install -y nginx
```

## Step 2: Setup Your Application

### Create application directory

```bash
mkdir -p /var/www/wizz-app
cd /var/www/wizz-app
```

### Clone your repository

```bash
git clone https://github.com/your-username/wizz-next-node.git .
```

Or upload files via SFTP/SCP.

### Install dependencies

```bash
# Install Next.js dependencies
yarn install

# Install server dependencies
cd server
yarn install
cd ..
```

### Create uploads directory

```bash
mkdir -p /var/www/wizz-app/uploads
chmod 755 /var/www/wizz-app/uploads
```

### Setup environment variables

Create `/var/www/wizz-app/.env`:

```bash
nano /var/www/wizz-app/.env
```

Add the following (replace with your values):

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_WHITE_LIST=your-email@example.com
NEXT_PUBLIC_API_URL=https://your-domain.com
```

Create `/var/www/wizz-app/server/.env`:

```bash
nano /var/www/wizz-app/server/.env
```

Add the following:

```env
PORT=4000
ALLOWED_ORIGINS=https://your-domain.com
MAX_FILE_SIZE=5242880
MAX_FILES=10
UPLOAD_DIR=/var/www/wizz-app/uploads
```

### Build the applications

```bash
# Build Next.js app
yarn build

# Build server
cd server
yarn build
cd ..
```

## Step 3: Setup PM2 Process Manager

### Create PM2 ecosystem file

Create `/var/www/wizz-app/ecosystem.config.js`:

```bash
nano /var/www/wizz-app/ecosystem.config.js
```

Add the following configuration:

```javascript
module.exports = {
  apps: [
    {
      name: 'wizz-next',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/wizz-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'wizz-server',
      script: 'dist/index.js',
      cwd: '/var/www/wizz-app/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### Start applications with PM2

```bash
cd /var/www/wizz-app
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Run the command that `pm2 startup` provides to ensure PM2 starts on system reboot.

## Step 4: Configure Nginx Reverse Proxy

### Create Nginx configuration

```bash
nano /etc/nginx/sites-available/wizz-app
```

Add the following configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # File upload size limit
    client_max_body_size 10M;

    # Serve uploaded files
    location /uploads/ {
        alias /var/www/wizz-app/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API endpoints (Node.js server)
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js application
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
}
```

### Enable the site

```bash
ln -s /etc/nginx/sites-available/wizz-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 5: Setup SSL with Let's Encrypt

### Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### Obtain SSL certificate

First, temporarily modify the Nginx config to work without SSL:

```bash
nano /etc/nginx/sites-available/wizz-app
```

Comment out the SSL server block and keep only the HTTP server block:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 10M;

    location /uploads/ {
        alias /var/www/wizz-app/uploads/;
    }

    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:

```bash
systemctl restart nginx
```

Now obtain the SSL certificate:

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

After obtaining the certificate, restore the full Nginx configuration from Step 4 and restart Nginx.

### Setup automatic renewal

```bash
certbot renew --dry-run
```

Certbot will automatically renew certificates before they expire.

## Step 6: Configure Firewall

```bash
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw enable
```

## Step 7: Testing

### Check PM2 status

```bash
pm2 status
pm2 logs wizz-next
pm2 logs wizz-server
```

### Test the application

Visit your domain in a browser:
- Main app: `https://your-domain.com`
- API health: `https://your-domain.com/api/health`

### Test file upload

Try uploading files through your application's file uploader component.

## Maintenance Commands

### View logs

```bash
# PM2 logs
pm2 logs wizz-next
pm2 logs wizz-server

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Restart applications

```bash
pm2 restart wizz-next
pm2 restart wizz-server
pm2 restart all
```

### Update application

```bash
cd /var/www/wizz-app
git pull
yarn install
yarn build

cd server
yarn install
yarn build
cd ..

pm2 restart all
```

### Monitor resources

```bash
pm2 monit
htop
```

## Troubleshooting

### Application won't start

Check PM2 logs:
```bash
pm2 logs
```

### 502 Bad Gateway

- Check if applications are running: `pm2 status`
- Check Nginx configuration: `nginx -t`
- Check firewall: `ufw status`

### File uploads failing

- Check uploads directory permissions: `ls -la /var/www/wizz-app/uploads`
- Check Nginx file size limit: `client_max_body_size` in config
- Check server logs: `pm2 logs wizz-server`

### SSL certificate issues

Renew certificate manually:
```bash
certbot renew --force-renewal
systemctl restart nginx
```

## Security Best Practices

1. Keep system packages updated: `apt update && apt upgrade`
2. Use strong passwords and SSH keys
3. Configure fail2ban to prevent brute force attacks
4. Regularly backup your uploads directory and database
5. Monitor logs for suspicious activity
6. Keep Node.js and dependencies updated

## Backup Strategy

### Backup uploads directory

```bash
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/wizz-app/uploads/
```

### Backup database

```bash
cp /var/www/wizz-app/data.db /var/www/wizz-app/backups/data-$(date +%Y%m%d).db
```

### Automated daily backups

Create a cron job:

```bash
crontab -e
```

Add:

```
0 2 * * * tar -czf /var/backups/uploads-$(date +\%Y\%m\%d).tar.gz /var/www/wizz-app/uploads/
0 2 * * * cp /var/www/wizz-app/data.db /var/backups/data-$(date +\%Y\%m\%d).db
```

---

# CI/CD Setup with GitHub Actions

Automate your deployments with GitHub Actions! Every push to the main/master branch will automatically deploy to your VPS.

## Step 1: Generate SSH Key for GitHub Actions

On your VPS, create a dedicated SSH key for deployments:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions -N ""
```

Add the public key to authorized_keys:

```bash
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
```

Display the private key (you'll need this for GitHub):

```bash
cat ~/.ssh/github-actions
```

Copy the entire private key output (including `-----BEGIN` and `-----END` lines).

## Step 2: Configure GitHub Secrets

Go to your GitHub repository settings:
1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add the following secrets:

### Required Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `SSH_PRIVATE_KEY` | The private key you just created | The full content from `github-actions` file |
| `REMOTE_HOST` | Your VPS IP address or domain | `123.456.789.0` |
| `REMOTE_USER` | SSH username (usually root) | `root` |
| `DEPLOY_PATH` | Path where app is deployed | `/var/www/wizz-app` |
| `NEXTAUTH_URL` | Your production domain | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Your secret from `.env` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Your Google client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Your Google secret |
| `NEXT_PUBLIC_ADMIN_WHITE_LIST` | Admin email addresses | `admin@example.com` |
| `NEXT_PUBLIC_API_URL` | Production API URL | `https://your-domain.com` |

### Optional Secrets

| Secret Name | Description | Default Value |
|------------|-------------|---------------|
| `REMOTE_PORT` | SSH port | `22` |

## Step 3: Initial Manual Setup Required

Before the first automated deployment, you must manually set up the VPS following the [Manual Deployment](#manual-deployment) steps above. This includes:

1. Installing Node.js, PM2, Nginx
2. Creating the application directory
3. Setting up the initial git repository
4. Configuring Nginx and SSL
5. Creating the PM2 ecosystem file

The CI/CD will handle subsequent deployments automatically.

## Step 4: Setup Git on VPS

If you haven't already, initialize git in your app directory:

```bash
cd /var/www/wizz-app
git init
git remote add origin https://github.com/your-username/wizz-next-node.git
git pull origin main  # or master
```

## Step 5: Test Your CI/CD Pipeline

1. Make a small change to your code
2. Commit and push to main/master branch:

```bash
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

3. Go to GitHub → **Actions** tab to watch the deployment progress
4. The workflow will:
   - Checkout code
   - Install dependencies
   - Build Next.js app
   - Build server
   - Deploy to VPS via SSH
   - Restart PM2 processes

## Step 6: Verify Deployment

After the GitHub Action completes:

1. Check the Actions tab for any errors
2. SSH into your VPS and verify:

```bash
pm2 status
pm2 logs wizz-next --lines 50
pm2 logs wizz-server --lines 50
```

3. Visit your domain to confirm the changes are live

## Manual Deployment Script

For manual deployments or local testing, use the deployment script:

```bash
# On your VPS
sudo bash /var/www/wizz-app/scripts/deploy.sh
```

This script will:
- Create a backup of the current deployment
- Pull latest changes from git
- Install dependencies
- Build applications
- Restart PM2 processes
- Verify deployment
- Rollback on failure

## Workflow Customization

The workflow file is located at `.github/workflows/deploy.yml`. You can customize:

- **Trigger branches**: Change which branches trigger deployment
- **Build commands**: Modify build steps
- **Environment variables**: Add/remove secrets
- **Deployment path**: Change where files are deployed
- **Excluded files**: Update files to exclude from deployment

### Example: Deploy on Tag Push Only

Modify `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    tags:
      - 'v*'  # Only deploy when pushing version tags
```

### Example: Add Deployment Notifications

Add a notification step to the workflow:

```yaml
- name: Send deployment notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Deployment Best Practices

1. **Test locally first**: Always test changes locally before pushing
2. **Use branches**: Develop on feature branches, merge to main when ready
3. **Monitor deployments**: Watch GitHub Actions and PM2 logs
4. **Keep secrets secure**: Never commit secrets to the repository
5. **Tag releases**: Use git tags for production releases
6. **Backup before major changes**: Create manual backups for major updates

## Rollback Strategy

### Automatic Rollback

The deployment script automatically rolls back if PM2 processes fail to start.

### Manual Rollback

If you need to manually rollback:

```bash
# On your VPS
cd /var/www/wizz-app

# List available backups
ls -lh /var/backups/wizz-app/

# Restore from backup
tar -xzf /var/backups/wizz-app/backup-YYYYMMDD_HHMMSS.tar.gz

# Restart applications
pm2 restart all
```

### Git Rollback

Rollback to a previous commit:

```bash
cd /var/www/wizz-app
git log --oneline  # Find the commit hash
git reset --hard <commit-hash>
yarn install
yarn build
cd server && yarn build && cd ..
pm2 restart all
```

## Troubleshooting CI/CD

### Deployment fails with SSH error

- Verify `SSH_PRIVATE_KEY` secret is correctly set
- Check SSH key is in `~/.ssh/authorized_keys` on VPS
- Ensure VPS allows SSH connections on the correct port

### Build fails in GitHub Actions

- Check if all required secrets are set
- Review the Actions log for specific error messages
- Ensure dependencies are correctly listed in `package.json`

### Deployment succeeds but app doesn't work

- SSH into VPS and check PM2 logs: `pm2 logs`
- Verify environment variables on VPS: `cat /var/www/wizz-app/server/.env`
- Check Nginx configuration: `nginx -t`

### Workflow doesn't trigger

- Verify you're pushing to the correct branch (main/master)
- Check repository settings → Actions → Allow all actions
- Review branch protection rules

## Support

For Fasthosts-specific issues, contact Fasthosts support:
- https://www.fasthosts.co.uk/support

For GitHub Actions issues:
- https://docs.github.com/en/actions

For application issues, check the logs and review the troubleshooting section above.
