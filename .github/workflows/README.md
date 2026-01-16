# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Available Workflows

### `deploy.yml` - Production Deployment

Automatically deploys the application to your Fasthosts VPS when changes are pushed to the main/master branch.

**Triggers:**
- Push to `main` or `master` branch
- Manual trigger via GitHub Actions UI

**What it does:**
1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies
4. Builds Next.js application
5. Builds Node.js server
6. Deploys to VPS via SSH
7. Restarts PM2 processes

**Required Secrets:**
- `SSH_PRIVATE_KEY` - SSH private key for deployment
- `REMOTE_HOST` - VPS IP or domain
- `REMOTE_USER` - SSH username
- `DEPLOY_PATH` - Deployment directory path
- `NEXTAUTH_URL` - Production URL
- `NEXTAUTH_SECRET` - NextAuth secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `ADMIN_WHITE_LIST` - Admin emails
- `NEXT_PUBLIC_API_URL` - API URL

## Manual Trigger

You can manually trigger deployments from the GitHub Actions tab:

1. Go to **Actions** in your repository
2. Select the **Deploy to Fasthosts VPS** workflow
3. Click **Run workflow**
4. Select the branch to deploy

## Monitoring Deployments

- View deployment status in the **Actions** tab
- Check detailed logs for each deployment step
- Receive notifications on deployment success/failure

## Customizing Workflows

Edit the workflow files to customize:
- Deployment triggers
- Build commands
- Environment variables
- Deployment steps

Refer to [GitHub Actions documentation](https://docs.github.com/en/actions) for more information.
