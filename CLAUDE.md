# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principles

**You are an autonomous debugging and development agent** for this Next.js + Prisma 7 + PostgreSQL application. Your workflow:

1. Run `yarn test` and `yarn build` to collect all current errors
2. Read each failing test and build error carefully
3. For each failure, read the relevant source files, identify the **root cause**, and apply a minimal fix
4. Re-run tests after each fix to verify it passes without introducing regressions
5. Repeat until all tests pass and the build succeeds

**IMPORTANT RULES:**

- **Never use npm** - This project uses Yarn 4.12.0 exclusively. Running npm will corrupt the lockfile.
- **After every code edit**, run `npx tsc --noEmit` and fix any errors before moving on. Do not ask to test — verify it yourself.
- **Before making ANY code changes**, explain what you think the root cause is and which file(s) need to change. Wait for confirmation before editing.
- **Never use `any` type** - use proper types, interfaces, or `unknown` if the type is truly unknown.
- **Make minimal, targeted changes** - do not refactor, rename, or modify files beyond what was explicitly requested.

---

## Build & Run

### Development

```bash
yarn dev              # Start Next.js dev server (http://localhost:3000)
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
```

### Database (Prisma 7 + PostgreSQL)

```bash
yarn db:migrate       # Run migrations in development
yarn db:migrate:prod  # Deploy migrations to production
yarn db:generate      # Generate Prisma client
yarn db:seed          # Seed development database
yarn db:seed:prod     # Seed production database
yarn db:reset         # Reset database (dev only)
```

**Note**: `postinstall` script automatically runs `prisma migrate deploy && prisma generate` on deployment.

### Testing

```bash
yarn test             # Run Jest test suite (no script defined yet - many tests skipped)
npx tsc --noEmit      # Type-check without emitting files
```

---

## Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode enabled)
- **Database**: PostgreSQL + Prisma ORM 7.2.0
- **State Management**: Zustand 5 with Redux DevTools middleware
- **Data Fetching**: Next.js Server Actions + React Query (TanStack Query)
- **Forms**: React Hook Form + Zod 4 validation
- **Authentication**: NextAuth.js v4 (Google OAuth)
- **Styling**: Tailwind CSS 4 + Radix UI Themes
- **File Storage**: Vercel Blob
- **Payments**: PayPal (server SDK + React integration)
- **Testing**: Jest + React Testing Library
- **Package Manager**: Yarn 4.12.0

### Folder Structure

```
/app
  /(pages)/           # Public routes
    /auth/            # Authentication pages
    /admin/           # Admin-only pages (protected by middleware)
    /basket/          # Shopping cart
    /product/         # Product pages
    /profile/         # User profile
  /actions/           # Server actions ('use server')
  /api/               # API routes
    /auth/            # NextAuth configuration
    /upload/          # File upload endpoints
  /components/        # React components
    /ui/              # Radix UI wrapper components
    /admin/           # Admin-specific components
    /products/        # Product-related components
  /providers/         # Context providers
  /stores/            # Zustand stores
    /order/           # Order/cart store
    /product/         # Product store
    /navigation/      # Nav state store
  /testing/           # Test utilities
  /utils/             # Utility functions

/lib
  /types.ts           # TypeScript type definitions
  /prisma.ts          # Prisma client singleton

/prisma
  /schema.prisma      # Database schema (Prisma 7 format)
  /migrations/        # Database migrations

/scripts
  /seed.dev.ts        # Development seed script
  /seed.prod.ts       # Production seed script
```

### Path Aliases (tsconfig.json)

```typescript
"@/*"          → root of project
"@/actions"    → app/actions/index.ts
"@/actions/*"  → app/actions/*
"@/stores"     → app/stores/index.ts
"@/stores/*"   → app/stores/*
"@/components/*" → app/components/*
"@/ui/*"       → app/components/ui/*
"@/utils/*"    → app/utils/*
"@/testing/*"  → app/testing/*
"@/providers/*" → app/providers/*
"@/services/*" → app/services/*
```

---

## Code Conventions

### TypeScript

- **Strict mode enabled** - all code must type-check without errors
- **Never use `any`** - use proper types, interfaces, or `unknown`
- Define types in `lib/types.ts` using Prisma type utilities:
  ```typescript
  export type ProductImage = Prisma.ProductImageGetPayload<object>;
  export type Product = Prisma.ProductGetPayload<{ include: { images: true } }>;
  ```

### Decimal Handling (CRITICAL)

**For Decimal fields from Prisma:**

- **Client components**: Use `decimal.js` library, NEVER import `Decimal` from `@prisma/client`
- **Server actions**: Convert Prisma Decimals to numbers for serialization:
  ```typescript
  return products.map(product => ({
    ...product,
    price: Number(product.price), // Prisma Decimal → number
  }));
  ```
- **DTOs**: Use `number` type for prices in DTOs sent to client

### Prisma 7 Conventions

**This project uses Prisma 7** - schema format and patterns differ from v6:

1. **Read `prisma/schema.prisma` before making changes** - don't assume v6 patterns
2. No deprecated lifecycle hooks (e.g., `on_event`)
3. Uses `@prisma/adapter-pg` for PostgreSQL connection
4. Datasource only specifies `provider`, connection string is from environment

### Server Actions Pattern

All data mutations use Server Actions (not API routes):

```typescript
"use server";

import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";

export const updateProduct = async (id: string, data: ProductUpdateInput) => {
  const product = await prisma.product.update({
    where: { id },
    data,
  });

  revalidateTag("products", "max");
  revalidatePath("/admin/products");

  return { ...product, price: Number(product.price) };
};
```

**Server Actions cannot stream responses** - use API routes for streaming.

### Zustand State Management

All stores use Zustand with Redux DevTools middleware:

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      products: [],
      setProducts: (products) => set({ products }),
    }),
    { name: "ProductStore" }
  )
);
```

**Usage in components:**

```typescript
// Direct store access
const products = useProductStore(state => state.products);
const setProducts = useProductStore(state => state.setProducts);

// Or get state imperatively
useProductStore.getState().setProducts(newProducts);
```

### Authentication & Authorization

- **NextAuth.js v4** with Google OAuth provider
- User roles: `USER` and `ADMIN` (enum in Prisma schema)
- Admin routes protected by middleware (see `middleware.ts`)
- Session extended with custom fields: `role`, `firstName`, `lastName`, `picture`

**Accessing session:**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const session = await getServerSession(authOptions);
if (session?.user.role !== "ADMIN") {
  // Redirect or deny access
}
```

### Component Conventions

- **Next.js Image components**: Always preserve aspect ratio. Never remove `width`/`height` props.
- **Radix UI wrappers**: Use components from `@/ui/*`, don't import Radix directly
- **Form validation**: Use React Hook Form + Zod schemas
- **Loading states**: Use `useTransition()` for server action pending states

### Error Handling

- **Server actions**: Use try/catch, return error states
- **Client components**: Handle errors from server actions in `useTransition()` or `useActionState()`
- **API routes**: Return appropriate HTTP status codes (200, 400, 401, 404, 500)

---

## Testing Conventions

### Test Setup

Tests use **Jest + React Testing Library**. No test runner script defined yet in package.json.

### Test File Patterns

- Test files: `*.test.tsx` or `*.test.ts`
- Co-located with components (e.g., `ProductEditor.tsx` → `ProductEditor.test.tsx`)
- Many tests currently use `describe.skip()` - check before assuming they run

### Mock Patterns

**1. Mock Zustand stores:**

```typescript
import { useProductStore } from "@/stores";

jest.mock("@/stores", () => ({
  ...jest.requireActual("@/stores"),
  useProductStore: jest.fn(),
}));

beforeEach(() => {
  (useProductStore as jest.Mock).mockReturnValue({
    products: [],
    setProducts: jest.fn(),
  });
});
```

**2. Mock Prisma client methods:**

Mock methods **directly** on the Prisma client (e.g., `prisma.product.findUnique`), not wrapper modules.

**Ensure mock method names match exactly** what the code calls:
- `findUnique` vs `findFirst`
- `product` vs `order`

**3. Mock server actions:**

```typescript
jest.mock("@/actions/product.actions", () => ({
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
}));
```

**4. Use `renderWithProviders` for component tests:**

```typescript
import { renderWithProviders } from "@/testing/utils";

test("renders component", () => {
  const { getByText } = renderWithProviders({
    children: <MyComponent />,
  });

  expect(getByText("Hello")).toBeInTheDocument();
});
```

### Running Tests

**Always run full test suite after changes:**

```bash
yarn test
```

**Type-check after every change:**

```bash
npx tsc --noEmit
```

---

## Common Pitfalls (DO NOT)

### Package Management

❌ **DO NOT use npm** - use `yarn` only. Running npm will corrupt `yarn.lock`.

```bash
# WRONG
npm install
npm add package-name

# CORRECT
yarn install
yarn add package-name
```

### Prisma & Database

❌ **DO NOT import Decimal from @prisma/client in client components**

```typescript
// WRONG (client component)
import { Decimal } from "@prisma/client";

// CORRECT (client component)
import Decimal from "decimal.js";
```

❌ **DO NOT use deprecated Prisma patterns** - this is Prisma 7, not v6

❌ **DO NOT attempt to use Prisma proxy URLs as direct database connection strings**

### Next.js & React

❌ **DO NOT remove width/height from Next.js Image components** - this breaks aspect ratio

❌ **DO NOT use API routes for streaming** in Server Actions - use API routes instead

❌ **DO NOT make excessive changes beyond what was requested** - minimal, targeted fixes only

### State Management

❌ **DO NOT dispatch Redux actions** - this project uses Zustand, not Redux

```typescript
// WRONG (old Redux pattern)
dispatch({ type: "UPDATE_PRODUCTS", payload: products });

// CORRECT (Zustand)
useProductStore.getState().setProducts(products);
```

### Testing

❌ **DO NOT mock wrapper modules instead of Prisma client directly**

❌ **DO NOT assume method names** - check the actual code to see if it uses `findUnique`, `findFirst`, etc.

### TypeScript

❌ **DO NOT use `any` to fix type errors** - use proper types or `unknown`

❌ **DO NOT skip type-checking** - run `npx tsc --noEmit` after every edit

### Environment & Deployment

❌ **DO NOT rely only on .env files for Vercel deployment** - environment variables must be set in Vercel dashboard

❌ **DO NOT quote values in .env files** - Vercel doesn't need quotes

---

## Database Schema (Prisma 7)

### Key Models

- **User** - Authentication and profile (Google OAuth)
  - Fields: `id`, `firstName`, `surname`, `email`, `phone`, `role` (enum: USER/ADMIN)

- **Product** - Product catalog
  - Fields: `id`, `name`, `description`, `price` (Decimal), `stock`, `isFeatured`, `isEnquiryOnly`, `categoryId`, `deleted`
  - Relations: `category`, `images[]`, `orderProducts[]`

- **ProductImage** - Product images
  - Fields: `id`, `productId`, `url`, `orderPosition`
  - Relations: `product`

- **Category** - Product categories
  - Fields: `id`, `name`, `description`
  - Relations: `products[]`

- **Order** - Customer orders
  - Fields: `id`, `customerName`, `customerEmail`, `customerPhone`, `status`, `totalAmount` (Decimal), `notes`
  - Relations: `orderProducts[]`

- **OrderProduct** - Order line items
  - Fields: `id`, `orderId`, `productId`, `productName`, `quantity`, `price` (Decimal)
  - Relations: `order`, `product`

### Decimal Fields

All monetary values (`price`, `totalAmount`) use `Decimal` type in Prisma:

```prisma
price Decimal @default(0) @db.Decimal(10, 2)
```

**When returning from server actions**, convert to `number`:

```typescript
return {
  ...product,
  price: Number(product.price),
};
```

---

## Environment Variables

See `.env.example` for reference. Key variables:

**Database:**
- `DATABASE_URL` - PostgreSQL connection string

**Authentication (NextAuth):**
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Session encryption secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Email (SMTP):**
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_SECURE` - Use TLS (true/false)
- `SMTP_EMAIL` - Sender email address
- `SMTP_PASSWORD` - SMTP password or app password

**PayPal:**
- PayPal SDK credentials (see PayPal integration docs)

**File Storage:**
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

**For Vercel deployment**: Set all environment variables in the Vercel dashboard, not just in `.env` files.

---

## Code Comments & Documentation

**All new functions, hooks, components, and complex logic must include comments:**

- **Functions & Hooks**: JSDoc-style comments explaining purpose, parameters, and return values
- **Complex Logic**: Inline comments explaining the "why" behind non-obvious logic
- **State Management**: Document what state tracks and when it updates
- **Validation Logic**: Clearly explain validation rules and error conditions
- **Form Handlers**: Comment what happens on different validation outcomes

Example:

```typescript
/**
 * Validates form data when user enters/changes values
 * - Updates field error state via the hook
 * - Stores valid values in component state
 * Only stores value if validation passes (no error)
 */
const onFieldValidation = ({ fieldName, value, type }: ValidationProps) => {
  handleValidation({ fieldName, value, type });

  // Only store the value if validation passed
  if (type !== "error") {
    setProductDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }
};
```

---

## Summary of Key Changes from Other Frameworks

If you're familiar with other stacks, note these key differences:

1. **Zustand, not Redux** - use store methods directly, no dispatch/actions
2. **Prisma 7, not v6** - read schema before assuming patterns
3. **Server Actions, not API routes** - for mutations and data fetching
4. **Yarn 4, not npm** - strict package manager requirement
5. **Decimal.js in client** - never import Decimal from Prisma client
6. **NextAuth v4** - not v5 (different API)
7. **App Router** - not Pages Router

---

## Quick Reference Commands

```bash
# Development
yarn dev
npx tsc --noEmit

# Testing
yarn test
yarn build

# Database
yarn db:migrate
yarn db:generate
yarn db:seed

# Deployment
git push origin main  # Auto-deploys to Vercel
```

---

**When in doubt**: Read the actual code, run type-checking, and make minimal changes. Always verify your changes with `npx tsc --noEmit` before moving on.
