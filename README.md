# Wizz Next.js Application

![Deployment Status](https://github.com/your-username/wizz-next-node/actions/workflows/deploy.yml/badge.svg)

A modern full-stack Next.js application with API routes and Prisma PostgreSQL database. Features automated deployment to VPS with systemd and CI/CD.

## Features

- Next.js 16 with App Router
- API Routes (no separate backend server)
- TypeScript for type safety
- Prisma PostgreSQL database with type-safe queries
- **Custom File Upload System** - Direct uploads to VPS
- **GitHub Actions CI/CD** - Automated deployment
- **Systemd Process Management** - Native Linux service
- NextAuth authentication with Google OAuth
- Modern UI with Tailwind CSS and Radix UI
- Product, Category, and Order management

## Architecture

This project uses a unified Next.js architecture:

- **Frontend & Backend**: Next.js on port 3000
- **API Routes**: `/api/*` endpoints
- **Database**: Prisma PostgreSQL (Prisma Accelerate)
- **File Uploads**: Stored in `uploads/` directory
- **Process Manager**: Systemd (native Linux)

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Database**: Prisma PostgreSQL with Prisma Accelerate
- **ORM**: Prisma Client for type-safe database queries
- **File Upload**: Next.js API routes with native file handling
- **Process Management**: Systemd
- **Package Manager**: Yarn
- **Hosting**: VPS with systemd service

## Getting Started

### Prerequisites

- Node.js 20+ and Yarn
- Prisma PostgreSQL database (or any PostgreSQL database)

### Installation

1. **Clone the repository**

2. **Install dependencies:**

```bash
yarn install
```

1. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

1. **Set up database:**

```bash
# Push Prisma schema to database
npx prisma db push

# Seed database with sample data
yarn seed
```

1. **Run development server:**

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
wizz-next-node/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── products/         # Product endpoints
│   │   ├── categories/       # Category endpoints
│   │   ├── orders/           # Order endpoints
│   │   ├── users/            # User endpoints
│   │   ├── posts/            # Post endpoints
│   │   ├── upload/           # File upload endpoints
│   │   └── uploads/          # Serve uploaded files
│   ├── components/           # React components
│   ├── (pages)/              # Next.js pages
│   └── layout.tsx
├── lib/                      # Shared utilities
│   ├── prisma.ts             # Prisma client singleton
│   ├── types.ts              # TypeScript types
│   └── api.ts                # API configuration
├── prisma/                   # Prisma configuration
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── systemd/                  # Systemd service files
│   ├── wizz-next.service     # Service configuration
│   └── README.md             # Setup instructions
├── scripts/
│   ├── seed.ts               # Database seeding
│   └── deploy.sh             # Manual deployment
├── uploads/                  # File uploads directory
└── schema.sql                # Database schema
```

## API Endpoints

All API endpoints are at `/api/*`

### Products

- `GET /api/products` - Get all products (with query params)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### File Upload

- `POST /api/upload/single` - Upload single file (max 5MB)
- `POST /api/upload/multiple` - Upload multiple files (max 10 files, 5MB each)
- `GET /api/uploads/:filename` - Serve uploaded file

## Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn seed` - Seed database with example data

## Database Schema

See `prisma/schema.prisma` for complete schema.

**Main models:**

- `Category` - Product categories
- `Product` - Product catalog
- `ProductImage` - Product images
- `Order` - Customer orders
- `OrderProduct` - Order line items

## Environment Variables

Create `.env` file:

```env
# Prisma PostgreSQL Database
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_api_key"
DIRECT_URL="postgres://user:password@host:5432/database?sslmode=verify-full"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
MAX_FILES=10
```

## Deployment

### Automated Deployment (GitHub Actions)

1. **Configure GitHub Secrets** (see `GITHUB_SECRETS.md`)
2. **Push to main/master branch**
3. Automatic deployment triggers

The CI/CD pipeline will:

- Build Next.js application
- Deploy to VPS via SSH
- Install/update systemd service
- Restart application

### Manual Deployment

On your VPS, run:

```bash
sudo bash /var/www/wizz-app/scripts/deploy.sh
```

### Process Management with Systemd

```bash
# Start service
sudo systemctl start wizz-next

# Stop service
sudo systemctl stop wizz-next

# Restart service
sudo systemctl restart wizz-next

# Check status
sudo systemctl status wizz-next

# View logs
sudo journalctl -u wizz-next -f
sudo tail -f /var/log/wizz-next/output.log

# Enable auto-start on boot
sudo systemctl enable wizz-next
```

See `systemd/README.md` for detailed setup instructions.

## File Uploads

The application includes a custom file uploader:

**Features:**

- Drag-and-drop interface
- Multiple file uploads (max 10 files)
- File validation (JPEG, PNG, GIF, WEBP)
- File size limit (5MB per file)
- Image preview and reordering
- Direct upload to VPS storage

**Storage:**

- Files stored in `uploads/` directory
- Served via `/api/uploads/:filename`
- Unique filenames with timestamp
- Automatic directory creation

## Monitoring

### Development

```bash
yarn dev  # Watch console output
```

### Production (on VPS)

```bash
sudo systemctl status wizz-next          # Check status
sudo journalctl -u wizz-next -f          # Follow logs
sudo journalctl -u wizz-next -n 100      # Last 100 lines
sudo tail -f /var/log/wizz-next/output.log  # File-based logs
```

## Customization

1. **Add new database models**: Update `prisma/schema.prisma` and run `npx prisma db push`
2. **Add new types**: Update `lib/types.ts`
3. **Add new API routes**: Create in `app/api/*/route.ts`
4. **Add new components**: Create in `app/components/`
5. **Add new pages**: Create in `app/(pages)/`

## Troubleshooting

### Application won't start

```bash
# Check service status
sudo systemctl status wizz-next

# View logs
sudo journalctl -u wizz-next -n 50

# Test manually
cd /var/www/wizz-app
yarn start
```

### Database connection issues

```bash
# Test Prisma connection
npx prisma db push

# Check .env file
cat .env

# View connection errors in logs
sudo journalctl -u wizz-next | grep -i prisma
```

### Port already in use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Accelerate](https://www.prisma.io/docs/accelerate)
- [Systemd Documentation](https://www.freedesktop.org/software/systemd/man/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## License

This project is private and proprietary.
