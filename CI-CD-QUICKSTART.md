# CI/CD Quick Start Guide

Get automated deployments running in 10 minutes!

## Prerequisites

- ✅ VPS is set up following [DEPLOYMENT.md](./DEPLOYMENT.md#manual-deployment)
- ✅ Application is running on VPS
- ✅ GitHub repository created

## Step 1: Generate SSH Key (2 minutes)

SSH into your VPS and run:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions -N ""
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github-actions
```

**Copy the entire private key output** (including BEGIN and END lines)

## Step 2: Add GitHub Secrets (5 minutes)

Go to GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 10 secrets:

| Secret Name | Where to Find It |
|------------|------------------|
| `SSH_PRIVATE_KEY` | Output from Step 1 |
| `REMOTE_HOST` | Your VPS IP (e.g., `123.456.789.0`) |
| `REMOTE_USER` | Usually `root` |
| `DEPLOY_PATH` | `/var/www/wizz-app` |
| `NEXTAUTH_URL` | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | From your `.env` file |
| `GOOGLE_CLIENT_ID` | From your `.env` file |
| `GOOGLE_CLIENT_SECRET` | From your `.env` file |
| `NEXT_PUBLIC_ADMIN_WHITE_LIST` | Your admin email |
| `NEXT_PUBLIC_API_URL` | `https://your-domain.com` |

## Step 3: Test Deployment (3 minutes)

Make a test change and push:

```bash
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

Go to **Actions** tab on GitHub and watch the magic happen! ✨

## That's It!

Your deployment is now automated. Every push to main will:

1. ✅ Build your application
2. ✅ Deploy to VPS
3. ✅ Restart services
4. ✅ Verify deployment

## Verify It Worked

1. Check GitHub Actions tab - should be green ✅
2. Visit your website - changes should be live
3. SSH to VPS and check: `pm2 status`

## Common Issues

### "Permission denied" error
- Make sure `SSH_PRIVATE_KEY` includes BEGIN and END lines
- Verify public key is in `~/.ssh/authorized_keys` on VPS

### Build fails
- Check all 10 secrets are added correctly
- Look at Actions logs for specific error

### Deployment succeeds but site doesn't update
- SSH to VPS: `pm2 logs`
- Check Nginx: `systemctl status nginx`

## Need Help?

See the full guides:
- [Complete Deployment Guide](./DEPLOYMENT.md)
- [CI/CD Detailed Setup](./DEPLOYMENT.md#cicd-setup-with-github-actions)
- [Troubleshooting](./DEPLOYMENT.md#troubleshooting-cicd)

## Manual Deployment

If CI/CD fails, you can always deploy manually:

```bash
# On your VPS
sudo bash /var/www/wizz-app/scripts/deploy.sh
```

---

**Pro Tip:** Test locally before pushing to avoid failed deployments!

```bash
yarn build  # Make sure build works
```
# Test CI/CD
