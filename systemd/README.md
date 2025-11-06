# Systemd Service Setup

This directory contains the systemd service configuration for the Wizz Next.js application.

## Installation on VPS

1. **Copy the service file to systemd directory:**
```bash
sudo cp systemd/wizz-next.service /etc/systemd/system/
```

2. **Create log directory:**
```bash
sudo mkdir -p /var/log/wizz-next
sudo chown www-data:www-data /var/log/wizz-next
```

3. **Reload systemd daemon:**
```bash
sudo systemctl daemon-reload
```

4. **Enable service to start on boot:**
```bash
sudo systemctl enable wizz-next
```

5. **Start the service:**
```bash
sudo systemctl start wizz-next
```

## Service Management Commands

### Start the service
```bash
sudo systemctl start wizz-next
```

### Stop the service
```bash
sudo systemctl stop wizz-next
```

### Restart the service
```bash
sudo systemctl restart wizz-next
```

### Check service status
```bash
sudo systemctl status wizz-next
```

### View logs
```bash
# View all logs
sudo journalctl -u wizz-next

# Follow logs in real-time
sudo journalctl -u wizz-next -f

# View last 100 lines
sudo journalctl -u wizz-next -n 100

# View logs from today
sudo journalctl -u wizz-next --since today

# View file-based logs
sudo tail -f /var/log/wizz-next/output.log
sudo tail -f /var/log/wizz-next/error.log
```

### Enable service (start on boot)
```bash
sudo systemctl enable wizz-next
```

### Disable service (don't start on boot)
```bash
sudo systemctl disable wizz-next
```

## Configuration

The service file is configured with:
- **User**: `www-data` (change if using different user)
- **Working Directory**: `/var/www/wizz-app` (change to match your deployment path)
- **Port**: 3000
- **Auto-restart**: Yes, with 10 second delay
- **Logs**: Both file-based and journald
- **Security**: Hardened with various protections

## Customization

If your setup differs, edit the service file:

```bash
sudo nano /etc/systemd/system/wizz-next.service
```

Then reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart wizz-next
```

## Troubleshooting

### Service won't start
```bash
# Check status for errors
sudo systemctl status wizz-next

# View detailed logs
sudo journalctl -u wizz-next -n 50 --no-pager
```

### Check if port is already in use
```bash
sudo lsof -i :3000
```

### Verify user permissions
```bash
# Ensure www-data can access the directory
sudo -u www-data ls -la /var/www/wizz-app
```

### Test application manually
```bash
cd /var/www/wizz-app
sudo -u www-data yarn start
```
