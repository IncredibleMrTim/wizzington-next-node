# GitHub SSH Key Setup for CI/CD

This guide will help you create and configure an SSH key for GitHub Actions to deploy to your VPS.

## Step 1: Connect to Your VPS

SSH into your Fasthosts VPS:

```bash
ssh root@YOUR_VPS_IP
```

Replace `YOUR_VPS_IP` with your actual VPS IP address.

## Step 2: Generate SSH Key for GitHub Actions

On your VPS, run this command:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions -N ""
```

This creates:

- Private key: `~/.ssh/github-actions`
- Public key: `~/.ssh/github-actions.pub`

**Explanation:**

- `-t ed25519` - Uses modern Ed25519 algorithm (more secure)
- `-C "github-actions-deploy"` - Adds a comment to identify the key
- `-f ~/.ssh/github-actions` - Specifies the filename
- `-N ""` - No passphrase (required for automated deployments)

## Step 3: Add Public Key to Authorized Keys

This allows GitHub Actions to connect to your VPS:

```bash
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
```

Verify it was added:

```bash
cat ~/.ssh/authorized_keys
```

## Step 4: Get the Private Key

Display the private key (you'll need this for GitHub):

```bash
cat ~/.ssh/github-actions
```

**IMPORTANT:** Copy the **entire output**, including the lines:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```


## Step 5: Set Correct Permissions

Ensure proper security permissions:

```bash
chmod 600 ~/.ssh/github-actions
chmod 600 ~/.ssh/github-actions.pub
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Step 6: Test the SSH Key Locally

While still on your VPS, test the key works:

```bash
ssh -i ~/.ssh/github-actions root@localhost
```

If it connects without asking for a password, the key works! Type `exit` to disconnect.

## Step 7: Add Private Key to GitHub Secrets

Now go to your GitHub repository:

1. Navigate to: `https://github.com/IncredibleMrTim/wizzington-next-node/settings/secrets/actions`

2. Click **"New repository secret"**

3. Add the secret:
   - **Name:** `SSH_PRIVATE_KEY`
   - **Secret:** Paste the entire private key you copied in Step 4

4. Click **"Add secret"**

## Step 8: Add Other Required GitHub Secrets

While you're in the Secrets page, add these additional secrets:

### Required Secrets

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `SSH_PRIVATE_KEY` | ✅ Already added | From Step 4 |
| `REMOTE_HOST` | Your VPS IP address | e.g., `123.456.789.0` |
| `REMOTE_USER` | `root` | Or your SSH username |
| `DEPLOY_PATH` | `/var/www/wizz-app` | Deployment directory |
| `NEXTAUTH_URL` | `https://your-domain.com` | Your production URL |
| `NEXTAUTH_SECRET` | Your secret | From `.env` file |
| `GOOGLE_CLIENT_ID` | Your client ID | From `.env` file |
| `GOOGLE_CLIENT_SECRET` | Your client secret | From `.env` file |
| `NEXT_PUBLIC_ADMIN_WHITE_LIST` | `your-email@example.com` | Admin emails |
| `NEXT_PUBLIC_API_URL` | `https://your-domain.com` | Production API URL |

### How to Add Each Secret

For each secret above:

1. Click **"New repository secret"**
2. Enter the **Name** exactly as shown
3. Enter the **Secret** value
4. Click **"Add secret"**


## Step 9: Verify Setup

Check that all secrets are added:

```text
https://github.com/IncredibleMrTim/wizzington-next-node/settings/secrets/actions
```


You should see all 10 secrets listed.

## Step 10: Test the Deployment

Make a small change to test:

```bash
# On your local machine
cd /Volumes/Tims\ SSD/Github/wizz-next-node

# Make a test change
echo "# Test CI/CD" >> CI-CD-QUICKSTART.md

# Commit and push
git add .
git commit -m "Test: Trigger CI/CD deployment"
git push origin main
```

## Step 11: Watch the Deployment

1. Go to: `https://github.com/IncredibleMrTim/wizzington-next-node/actions`

2. You should see a workflow running called **"Deploy to Fasthosts VPS"**

3. Click on it to watch the deployment progress

4. If successful, you'll see green checkmarks ✅

## Troubleshooting

### "Permission denied (publickey)" Error

**Problem:** GitHub Actions can't connect to VPS

**Solutions:**

1. Verify the private key is exactly as copied (including BEGIN/END lines)
2. Check public key is in `~/.ssh/authorized_keys` on VPS
3. Verify permissions (Step 5)
4. Ensure SSH is running on VPS: `systemctl status sshd`


### SSH Key Format Issues

If you get "invalid format" errors, make sure:

- You copied the **private key** (not the public key)
- You included the `-----BEGIN OPENSSH PRIVATE KEY-----` line
- You included the `-----END OPENSSH PRIVATE KEY-----` line
- No extra spaces or line breaks were added


### Testing SSH Connection from GitHub Actions

To test if the SSH connection will work, try this from any machine:

```bash
# Save your private key to a temporary file
nano /tmp/test_key

# Paste the private key, save and exit (Ctrl+X, Y, Enter)

# Set permissions
chmod 600 /tmp/test_key

# Test connection
ssh -i /tmp/test_key root@YOUR_VPS_IP

# If successful, clean up
rm /tmp/test_key
```

### Workflow Doesn't Trigger

**Problem:** Push to main but no deployment runs

**Solutions:**

1. Check repository settings: Settings → Actions → General
2. Ensure "Allow all actions and reusable workflows" is selected
3. Verify you pushed to `main` branch (not `master` or other)
4. Check the workflow file exists: `.github/workflows/deploy.yml`


### Deployment Succeeds but Site Doesn't Update

**Problem:** Green checkmark but no changes visible

**Solutions:**

1. SSH to VPS: `ssh root@YOUR_VPS_IP`
2. Check PM2 status: `pm2 status`
3. Check logs: `pm2 logs`
4. Verify files updated: `cd /var/www/wizz-app && git log -1`
5. Restart manually: `pm2 restart all`


## Security Best Practices

1. ✅ **Never commit private keys** to your repository
2. ✅ **Use separate keys** for different purposes
3. ✅ **Rotate keys regularly** (every 6-12 months)
4. ✅ **Remove old keys** from `authorized_keys` when no longer needed
5. ✅ **Monitor GitHub Actions logs** for suspicious activity

## Removing the Key (If Needed)

If you need to remove the key later:

```bash
# On your VPS
nano ~/.ssh/authorized_keys

# Delete the line containing "github-actions-deploy"
# Save and exit (Ctrl+X, Y, Enter)

# Delete the key files
rm ~/.ssh/github-actions
rm ~/.ssh/github-actions.pub
```

On GitHub:

1. Go to repository secrets
2. Click the trash icon next to `SSH_PRIVATE_KEY`


## Next Steps

Once setup is complete:

1. ✅ SSH key generated and configured
2. ✅ All GitHub secrets added
3. ✅ Test deployment successful
4. 🚀 **You're ready!** Every push to main will auto-deploy

## Quick Reference Commands

```bash
# Generate key
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions -N ""

# Add to authorized keys
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys

# View private key
cat ~/.ssh/github-actions

# Test key
ssh -i ~/.ssh/github-actions root@localhost

# Set permissions
chmod 600 ~/.ssh/github-actions ~/.ssh/github-actions.pub ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## Support

- Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Quick start: [CI-CD-QUICKSTART.md](./CI-CD-QUICKSTART.md)
- GitHub Actions docs: <https://docs.github.com/en/actions>
