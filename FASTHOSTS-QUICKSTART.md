# Fasthosts Plesk + PM2 Quick Start

## The Problem

"I don't see my files in Plesk after deployment!"

## The Solution

**You're looking in the wrong place!** Your files are there, just not where Plesk shows by default.

## Where Are My Files?

### ❌ WRONG Location (where Plesk opens by default):
```
/var/www/vhosts/yourdomain.com/httpdocs/
```

This is for static websites (HTML/PHP). **Your Node.js app doesn't use this!**

### ✅ CORRECT Location (where your app actually is):
```
/var/www/wizz-app/
```

This is where PM2 runs your Next.js and Express apps.

## How to Find Them in Plesk

1. Open Plesk control panel
2. Go to **Files** → **File Manager**
3. Look at the path bar (top of file listing)
4. Type or navigate to: `/var/www/wizz-app/`
5. You'll see your files: `package.json`, `.next/`, `server/`, etc.

## Why Two Different Locations?

| Type | Location | Served By | Your Setup |
|------|----------|-----------|------------|
| **Static Site** (HTML/PHP) | `httpdocs/` | Apache/Nginx directly | ❌ No |
| **Node.js App** (PM2) | `/var/www/wizz-app/` | PM2 processes | ✅ Yes |

Your setup:
```
Internet Request
    ↓
Plesk (Apache/Nginx)
    ↓ (proxy)
PM2 Apps in /var/www/wizz-app/
    ├─ Next.js on port 3000
    └─ Express on port 3001
```

## Quick Checks

### 1. Verify GitHub Secret

GitHub repo → **Settings** → **Secrets** → Check `DEPLOY_PATH`:
```
DEPLOY_PATH=/var/www/wizz-app
```

### 2. Check Deployment Logs

GitHub → **Actions** → Latest run → Look for:
```
=== Deployment Information ===
Target deployment path: /var/www/wizz-app
✓ package.json found
✓ .next directory found
✓ server directory found
```

### 3. SSH and Verify (Optional)

```bash
ssh your-user@your-server
cd /var/www/wizz-app
ls -la
# You should see your files here

pm2 list
# Should show wizz-next and wizz-server running
```

## If You Still Don't See Files

1. **Check the workflow ran successfully**
   - GitHub → Actions tab → Latest workflow should be green ✓

2. **Check the deployment path in logs**
   - Look for "Target deployment path: /var/www/wizz-app"

3. **Verify SSH key has permissions**
   - SSH user should have write access to `/var/www/wizz-app`

4. **Check PM2 is running**
   - SSH into server: `pm2 list`
   - Should show 2 processes running

## What About httpdocs Then?

**You don't need it!**

For Node.js apps with PM2:
- Apps run from `/var/www/wizz-app/`
- Plesk's web server (Nginx/Apache) just proxies to PM2
- `httpdocs/` can stay empty or have a redirect

## Need More Help?

- Full setup guide: [PLESK-SETUP.md](./PLESK-SETUP.md)
- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Run diagnostic: `bash plesk-configs/diagnostic.sh` (on your VPS)

## Summary

✅ Files deploy to: `/var/www/wizz-app/`
✅ Find them in Plesk File Manager at that path
❌ Don't look in `httpdocs/` - that's for static sites
✅ PM2 runs your app from `/var/www/wizz-app/`
