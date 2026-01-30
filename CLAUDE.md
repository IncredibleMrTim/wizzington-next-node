# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

**IMPORTANT: This project uses Yarn, not npm. Always use `yarn` for package management.**

### Development
- `yarn dev` - Start Next.js dev server (http://localhost:3000)
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

### Database
- `yarn db:migrate` - Run Prisma migrations
- `yarn db:seed` - Seed the database with initial data
- `yarn db:generate` - Generate Prisma client
- `yarn db:reset` - Reset database to initial state (runs migrations)

### Testing
- Tests use Jest with React Testing Library
- No test runner script defined yet; tests files are marked with `.test.tsx`
- Many test files use `describe.skip()` - check `app/components/admin/productEditor/useProductEditor.test.tsx` as reference

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + Radix UI themes
- **State Management**: Zustand (with Redux DevTools middleware)
- **Data Fetching**: Next.js Server Actions
- **Forms**: React Hook Form + Zod validation
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v4 (Google OAuth)
- **File Storage**: Vercel Blob
- **Payments**: PayPal (server SDK + React integration)

### State Management (Zustand + Redux DevTools)
All application state uses Zustand stores with Redux DevTools integration:

**Stores Location**: `app/stores/`
- `useProductStore.ts` - Product catalog and editing state
- `useOrderStore.ts` - Shopping cart and order data
- `useNavStore.ts` - Navigation/drawer open state

Each store wraps its state with the `devtools` middleware:
```typescript
export const useProductStore = create<ProductState>()(
  devtools((set) => ({ /* state */ }), { name: "ProductStore" })
);
```

This enables Redux DevTools in browser for debugging state changes.

### Data Fetching Pattern
Uses Next.js Server Actions for data fetching and mutations:
- Server actions defined in `app/actions/` (organized by domain)
- Actions use `'use server'` directive for security
- Client components call actions via `useTransition()` or `useActionState()` hooks
- Errors handled via try/catch in server actions

### Authentication & Authorization
- Google OAuth via NextAuth.js
- User roles: `USER` and `ADMIN`
- Admin routes protected by middleware (`middleware.ts`)
- Session extended with custom fields: `role`, `firstName`, `lastName`, `picture`

### Database Schema (Prisma)
Key entities:
- `User` - Authentication and profile
- `Product` - Catalog with images and categories
- `Category` - Product grouping
- `Order` - Customer orders with line items
- `OrderProduct` - Order line items with custom fields

See `prisma/schema.prisma` for full schema.

## Key File Locations

### Routes & Pages
- Public pages: `app/(pages)/`
- Admin pages: `app/(pages)/admin/`
- API endpoints: `app/api/`
- Authentication: `app/api/auth/[...nextauth]/route.ts`

### Components
- Reusable UI: `app/components/ui/` (Radix UI wrapped)
- Feature components: `app/components/` (organized by feature)
- Special components:
  - `FileUploader.tsx` - Image upload with Vercel Blob integration
  - `PayPalButton.tsx` - Payment processing
  - `ProductEditor.tsx` - Admin product management

### Utilities & Services
- API utilities: `app/utils/`
- Email: `app/utils/email.ts`
- Auth helpers: `app/utils/auth.ts`
- Date formatting: `app/utils/date.ts`
- Server actions: `app/actions/` (organized by domain)

### Providers
- `SessionProvider.tsx` - NextAuth session wrapper

## Important Implementation Details

### File Uploads
- Uses Vercel Blob for storage
- Endpoint: `app/api/upload/blob/route.ts`
- Integrated with product editor via `FileUploader.tsx`
- Stores references in Prisma `ProductImage` table

### State Update Patterns
After recent migration from Redux to Zustand, **always use store methods directly**:
```typescript
// Correct: Direct Zustand call
useProductStore.getState().updateProductImages(images);

// Wrong: Do not dispatch actions
dispatch({ type: "UPDATE", payload: images });
```

### Product Editor Hook
`useProductEditor.ts` manages:
- Loading product data by ID (if editing)
- Handling image updates via store
- Saving products (creates or updates)
- Clearing state on unmount

Always use the returned `save()`, `updateImages()` methods - they handle store updates correctly.

### Field Validation
Custom field validation in `ProductField.tsx`:
- Validates on change via Zod schemas
- Passes validation errors up to parent
- Parent (`page.tsx`) tracks field errors in state

## Common Tasks

### Adding a New API Endpoint
1. Create route file: `app/api/[feature]/route.ts`
2. Use Prisma client: `import prisma from "@/lib/prisma"`
3. Handle auth if needed via `NextAuth`

### Adding a New Zustand Store
1. Create file: `app/stores/[feature]/use[Feature]Store.ts`
2. Wrap with devtools middleware (see ProductStore example)
3. Export from `app/stores/index.ts`
4. Use selector pattern in components: `useStore((state) => state.property)`

### Creating a New Server Action
1. Create file: `app/actions/[domain].ts`
2. Add `'use server'` directive at top of file
3. Define async function that handles the action logic
4. Use `useTransition()` or `useActionState()` in client components to call the action
5. Handle errors with try/catch in the server action

### Adding Authentication to a Route
Admin routes are auto-protected by middleware if prefixed with `/admin`. For custom auth:
1. Get session: `const session = await getServerSession(authOptions)`
2. Check role: `if (session?.user.role !== "ADMIN")`

## File Path Aliases
TypeScript paths configured in `tsconfig.json`:
- `@/*` - Root of project (useful for relative imports)
- `@/stores` - `app/stores/index.ts`
- `@/stores/*` - `app/stores/[path]`
- `@/services/*` - `app/services/[path]`
- `@/components/*` - `app/components/[path]`
- `@/ui/*` - `app/components/ui/[path]`
- `@/utils/*` - `app/utils/[path]`

## Environment Variables
See `.env.example` for required variables:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - NextAuth config
- `SMTP_EMAIL` - Email notifications
- PayPal SDK credentials
- Database connection string

## Development Patterns to Follow

### Code Comments & Documentation
**All new functions, hooks, components, and complex logic must include comments:**
- **Functions & Hooks**: Add JSDoc-style comments explaining purpose, parameters, and return values
- **Complex Logic**: Add inline comments explaining the "why" behind non-obvious logic
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

### Error Handling
- Server actions: Use try/catch, return error states or throw errors
- Client components: Handle errors from server actions in `useTransition()` or `useActionState()`
- API routes: Return appropriate HTTP status codes

### Loading States
- Use `useTransition()` hook's `isPending` state from server actions
- Use `useActionState()` for form submissions with loading states
- Disable buttons/forms during pending actions

### Type Safety
- Strict TypeScript enabled (`strict: true`)
- Define types in `lib/types.ts`
- Use Zod for runtime validation on API boundaries

### Testing
- Use `renderWithProviders` from `app/testing/utils.tsx` to wrap components with all providers
- Mock Zustand stores via `jest.mock()` at module level
- Mock server actions via `jest.mock()` at module level
