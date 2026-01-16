# Wizz Next Node

![Deployment Status](https://github.com/your-username/wizz-next-node/actions/workflows/deploy.yml/badge.svg)

A full-stack application with React Next.js frontend and Express Node.js backend using SQLite database. Features automated deployment to Fasthosts VPS with CI/CD.

## Features

- Next.js 16 with App Router for frontend
- Express.js backend with clean architecture
- TypeScript for type safety across frontend and backend
- SQLite database with better-sqlite3
- RESTful API with CRUD operations
- **Custom File Upload System** - Direct uploads to VPS (no AWS required)
- **GitHub Actions CI/CD** - Automated deployment to Fasthosts VPS
- NextAuth authentication with Google OAuth
- Modern UI with Tailwind CSS and Radix UI
- User and Post management system
- Concurrent development setup

## Architecture

This project uses a separated frontend/backend architecture:

- **Frontend**: Next.js runs on `localhost:3000`
- **Backend**: Express.js runs on `localhost:4000`
- **Database**: SQLite shared between frontend and backend

## Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: SQLite (better-sqlite3)
- **File Upload**: Multer
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn installed on your machine

### Installation

1. Clone the repository

2. Install root dependencies:
```bash
yarn install
```

3. Install server dependencies:
```bash
cd server && yarn install && cd ..
```

4. Seed the database with example data:
```bash
yarn seed
```

5. Run both frontend and backend concurrently:
```bash
yarn dev
```

This will start:
- Next.js frontend on [http://localhost:3000](http://localhost:3000)
- Express backend on [http://localhost:4000](http://localhost:4000)

### Running Servers Separately

If you prefer to run servers separately:

```bash
# Terminal 1 - Frontend
yarn dev:next

# Terminal 2 - Backend
yarn dev:server
```

## Project Structure

```
wizz-next-node/
├── server/                   # Express backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── user.controller.ts
│   │   │   ├── post.controller.ts
│   │   │   └── upload.controller.ts
│   │   ├── models/           # Database queries
│   │   │   ├── user.model.ts
│   │   │   └── post.model.ts
│   │   ├── routes/           # API routes
│   │   │   ├── user.routes.ts
│   │   │   ├── post.routes.ts
│   │   │   ├── upload.routes.ts
│   │   │   └── index.ts
│   │   ├── middleware/       # Express middleware
│   │   │   ├── upload.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── db.ts             # Database initialization
│   │   └── index.ts          # Express app setup
│   ├── package.json
│   └── tsconfig.json
├── app/                      # Next.js frontend
│   ├── layout.tsx
│   └── page.tsx
├── components/               # React components
│   ├── UserManager.tsx
│   └── PostManager.tsx
├── lib/                      # Shared utilities
│   ├── api.ts                # API configuration
│   └── types.ts              # Shared TypeScript types
├── scripts/
│   └── seed.ts               # Database seeding
├── uploads/                  # File uploads directory
└── data.db                   # SQLite database
```

## API Endpoints

All API endpoints are served from the Express backend at `http://localhost:4000/api`

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Posts

- `GET /api/posts` - Get all posts with user names
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### File Upload

- `POST /api/upload/single` - Upload a single file (max 5MB)
  - Field name: `file`
  - Accepted types: jpeg, jpg, png, gif, webp
- `POST /api/upload/multiple` - Upload multiple files (max 10 files, 5MB each)
  - Field name: `files`

### Health Check

- `GET /health` - Server health check

## Scripts

### Root Directory

- `yarn dev` - Start both frontend and backend concurrently
- `yarn dev:next` - Start Next.js frontend only
- `yarn dev:server` - Start Express backend only
- `yarn build` - Build both frontend and backend
- `yarn start` - Start both in production mode
- `yarn lint` - Run ESLint
- `yarn seed` - Seed database with example data

### Server Directory

- `yarn dev` - Start Express server in watch mode
- `yarn build` - Compile TypeScript to JavaScript
- `yarn start` - Start compiled production server

## Database Schema

### Users Table
- `id` - Integer (Primary Key, Auto Increment)
- `name` - Text (Not Null)
- `email` - Text (Unique, Not Null)
- `created_at` - DateTime (Default: Current Timestamp)

### Posts Table
- `id` - Integer (Primary Key, Auto Increment)
- `title` - Text (Not Null)
- `content` - Text (Nullable)
- `user_id` - Integer (Foreign Key to Users, Cascade Delete)
- `created_at` - DateTime (Default: Current Timestamp)

## Backend Architecture

The Express backend follows a clean, functional architecture:

- **Controllers**: Handle HTTP requests and responses
- **Models**: Encapsulate database queries
- **Routes**: Define API endpoints
- **Middleware**: Handle cross-cutting concerns (CORS, error handling, file uploads)

All backend code uses **functions instead of classes** for simplicity and functional programming style.

## Environment Variables

### Frontend (.env.local)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_WHITE_LIST=your-email@example.com
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (server/.env)

```env
PORT=4000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
MAX_FILE_SIZE=5242880
MAX_FILES=10
UPLOAD_DIR=../uploads
```

## File Uploads

The application includes a custom file uploader that uploads directly to your VPS (no AWS required):

**Features:**
- Drag-and-drop interface
- Multiple file uploads (max 10 files)
- File validation (JPEG, PNG, GIF, WEBP)
- File size limit (5MB per file)
- Upload progress tracking
- Image preview and reordering
- Direct upload to VPS storage

**Storage:**
- Files stored in `uploads/` directory
- Served statically at `/uploads/:filename`
- Unique filenames with timestamp

**Component:** `app/components/fileUploader/FileUploader.tsx`

## Deployment

This project is configured for automated deployment to Fasthosts VPS.

### Quick Start

1. **Manual Setup**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md#manual-deployment) to set up your VPS
2. **CI/CD Setup**: Configure [GitHub Actions](./DEPLOYMENT.md#cicd-setup-with-github-actions) for automated deployments
3. **Deploy**: Push to main/master branch to automatically deploy

### GitHub Actions CI/CD

Every push to main/master triggers automatic deployment:
- ✅ Builds Next.js application
- ✅ Builds Node.js server
- ✅ Deploys to VPS via SSH
- ✅ Restarts PM2 processes
- ✅ Automatic rollback on failure

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Manual Deployment

For manual deployments, use the deployment script on your VPS:

```bash
sudo bash /var/www/wizz-app/scripts/deploy.sh
```

## Customization

To customize this boilerplate:

1. **Add new database tables**: Update `server/src/db.ts`
2. **Add new types**: Update `server/src/types/index.ts`
3. **Add new models**: Create files in `server/src/models/`
4. **Add new controllers**: Create files in `server/src/controllers/`
5. **Add new routes**: Create files in `server/src/routes/` and register in `server/src/routes/index.ts`
6. **Add new components**: Create files in `components/`
7. **Update UI**: Modify `app/page.tsx` or create new pages

## Deployment Files

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `scripts/deploy.sh` - Manual deployment script
- `DEPLOYMENT.md` - Complete deployment guide
- `ecosystem.config.js` - PM2 configuration (created on VPS)

## Monitoring

### Development
```bash
yarn dev  # Watch console output
```

### Production (on VPS)
```bash
pm2 status              # Check process status
pm2 logs wizz-next      # Next.js logs
pm2 logs wizz-server    # Server logs
pm2 monit               # Real-time monitoring
```

## Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for common issues and solutions.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [Multer Documentation](https://github.com/expressjs/multer)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)

## License

This project is private and proprietary.
