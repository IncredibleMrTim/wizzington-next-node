# Plesk/Passenger Setup Guide - Separate Frontend & Backend

This project is now configured to run as **two separate Node.js applications** in Plesk.

## Architecture
- **Frontend (Next.js)**: Serves the website UI
- **Backend (Express API)**: Handles API requests and database operations

---

## Application 1: Next.js Frontend

### Plesk Configuration
1. **Application Root**: `/path/to/wizz-next-node`
2. **Application Startup File**: `app.js`
3. **Node.js Version**: Select Node.js 18+ or 20+
4. **Application Mode**: Production

### Environment Variables
```
NODE_ENV=production
PORT=3000
```

### Build Commands (run via SSH before enabling the app)
```bash
cd /path/to/wizz-next-node
yarn install
yarn build
```

### Domain/Subdomain
- Assign your main domain (e.g., `example.com`)
- Or a subdomain (e.g., `www.example.com`)

---

## Application 2: Express Backend API

### Plesk Configuration
1. **Application Root**: `/path/to/wizz-next-node/server`
2. **Application Startup File**: `dist/index.js`
3. **Node.js Version**: Select Node.js 18+ or 20+
4. **Application Mode**: Production

### Environment Variables
```
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-frontend-domain.com
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
UPLOAD_DIR=/path/to/uploads
```

### Build Commands (run via SSH before enabling the app)
```bash
cd /path/to/wizz-next-node/server
yarn install
yarn build
```

### Domain/Subdomain
- Assign an API subdomain (e.g., `api.example.com`)
- Or use a path-based routing via reverse proxy

---

## Important Notes

### CORS Configuration
The backend's `ALLOWED_ORIGINS` environment variable **must include** your frontend URL:
```
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

### Frontend API Configuration
Your Next.js app needs to know where the API is. Create a `.env.production` file in the root:
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Database Access
Ensure the backend can connect to your MySQL database. Update the DB_* environment variables accordingly.

### File Uploads
The `UPLOAD_DIR` should point to a directory writable by the Node.js process. Make sure permissions are set correctly:
```bash
mkdir -p /path/to/uploads
chmod 755 /path/to/uploads
```

---

## Deployment Checklist

- [ ] Build Next.js: `yarn build` in root directory
- [ ] Build Express: `yarn build` in server directory
- [ ] Configure Frontend app in Plesk
- [ ] Configure Backend app in Plesk
- [ ] Set all required environment variables
- [ ] Test frontend at your domain
- [ ] Test backend API at `/api/health` endpoint
- [ ] Verify CORS is working between frontend and backend
- [ ] Check Passenger logs if any issues arise

---

## Troubleshooting

### Check Passenger Logs
In Plesk: Websites & Domains → your domain → Node.js → View Logs

### Test API Health Check
```bash
curl https://api.example.com/health
```
Should return: `{"status":"ok","message":"Server is running"}`

### Test Frontend
Visit your domain in a browser and check the browser console for any API connection errors.

### Restart Applications
After configuration changes, restart both apps in Plesk:
Websites & Domains → Node.js → Restart App
