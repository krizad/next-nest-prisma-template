# Architecture

Overview of the full-stack monorepo architecture, design patterns, and technical decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Next.js Frontend (Port 3000)              │    │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────┐    │    │
│  │  │   App    │ │ Features │ │ API Client     │    │    │
│  │  │  Router  │ │ (Auth/   │ │ (Axios)        │    │    │
│  │  │          │ │  User)   │ │                │    │    │
│  │  └──────────┘ └──────────┘ └────────────────┘    │    │
│  │                      ↓                              │    │
│  │              @fullstack/shared-types                │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP (proxied via Next.js rewrites)
                       │ /api → http://localhost:3001/api/v1
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              NestJS Backend (Port 3001)                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Controllers → Services → Repositories              │    │
│  │       ↓                                              │    │
│  │  Guards/Interceptors/Filters                         │    │
│  │       ↓                                              │    │
│  │  Prisma ORM                                          │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────────┘
                       │ SQL Queries
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Port 5432)                 │
│                                                              │
│  ┌──────────┐  ┌──────────────────┐  ┌─────────────┐      │
│  │  users   │  │  refresh_tokens  │  │  (other)    │      │
│  └──────────┘  └──────────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

### Workspaces

The project uses **pnpm workspaces** to manage multiple packages:

#### 1. Backend (`@fullstack/backend`)
- **Framework**: NestJS v11
- **ORM**: Prisma v7
- **Database**: PostgreSQL 16
- **Architecture**: Clean Architecture + DDD

#### 2. Frontend (`@fullstack/frontend`)
- **Framework**: Next.js v16 (App Router)
- **React**: v19 with Server Components
- **Styling**: Tailwind CSS v4
- **State**: Zustand

#### 3. Shared Types (`@fullstack/shared-types`)
- **Types**: TypeScript interfaces and types
- **Validators**: Zod schemas
- **Constants**: Enums (UserRole, etc.)
- **DTOs**: Data Transfer Objects

### Dependency Graph

```
frontend → shared-types
backend  → shared-types
shared-types → (standalone)
```

## Backend Architecture

### Layered Architecture

```
┌──────────────────────┐
│   Controllers        │ ← HTTP layer (routes, validation)
└──────────────────────┘
          ↓
┌──────────────────────┐
│   Services           │ ← Business logic
└──────────────────────┘
          ↓
┌──────────────────────┐
│   Repositories       │ ← Data access (Prisma)
└──────────────────────┘
          ↓
┌──────────────────────┐
│   Database           │ ← PostgreSQL
└──────────────────────┘
```

### Module Structure

```
backend/src/
├── common/              # Shared utilities
│   ├── decorators/     # Custom decorators (@Public, @CurrentUser)
│   ├── filters/        # Exception filters
│   ├── guards/         # Authorization guards
│   ├── interceptors/   # Response/logging interceptors
│   └── types/          # Shared types
│
├── config/             # Configuration modules
│   ├── app.config.ts
│   ├── database.config.ts
│   └── jwt.config.ts
│
├── infra/              # Infrastructure layer
│   └── database/       # Prisma service & extensions
│
└── modules/            # Feature modules
    ├── auth/           # Authentication (login, refresh, logout)
    └── users/          # User CRUD operations
```

### Request/Response Flow

1. **Request** → Controller
2. Controller validates DTO (class-validator)
3. Guards check authentication/authorization
4. Service handles business logic
5. Repository accesses database (Prisma)
6. **Response** → Interceptor wraps in standard format
7. Client receives: `{success, data, context}`

## Frontend Architecture

### App Router Structure

```
frontend/src/app/
├── (auth)/             # Auth pages (login, register)
│   └── login/
├── dashboard/          # Protected dashboard
├── profile/            # User profile
├── api/                # API routes
└── components/         # Page-specific components
```

### Feature-Based Organization

```
frontend/src/
├── features/           # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   └── user/
│       ├── components/
│       └── services/
│
├── components/         # Shared components
│   ├── ui/            # UI primitives
│   └── common/        # Layouts, nav
│
├── lib/               # Utilities
│   ├── api-client.ts  # Axios wrapper
│   └── validations/   # Zod schemas
│
└── store/             # Global state (Zustand)
```

## API Integration

### Next.js Rewrites

Frontend requests to `/api/*` are proxied to backend:

```typescript
// next.config.ts
{
  rewrites: async () => [{
    source: '/api/:path*',
    destination: 'http://localhost:3001/api/v1/:path*'
  }]
}
```

**Benefits:**
- No CORS configuration needed
- Same-origin requests
- Transparent to frontend code

### API Response Format

Backend returns standardized responses:

**Success:**
```typescript
{
  success: true,
  data: T,
  meta?: PaginationMeta,  // For paginated responses
  context: {
    requestId: string,
    path: string,
    method: string,
    status: number,
    timestamp: string
  }
}
```

**Error:**
```typescript
{
  success: false,
  error: {
    message: string,
    code?: string,
    type?: string,
    details?: any
  },
  context: ContextMeta
}
```

## Shared Types

### Type Safety Flow

```
1. Database Schema (Prisma)
        ↓
2. Backend DTOs (NestJS classes)
        ↓
3. Shared Types (@fullstack/shared-types)
        ↓
4. Frontend Types (imported from shared-types)
        ↓
5. UI Components
```

### Validation Strategies

- **Backend**: class-validator decorators on DTOs
- **Frontend**: Zod schemas from shared-types
- **Runtime**: `zod.parse()` validates user input

## Authentication

### JWT Flow

```
1. Login → POST /api/auth/login
   ← {accessToken, refreshToken, user}

2. Store tokens in:
   - Memory (accessToken)
   - localStorage (refreshToken)
   - Cookie (for middleware)

3. API requests:
   Authorization: Bearer <accessToken>

4. Token expires:
   → POST /api/auth/refresh {refreshToken}
   ← {accessToken, refreshToken}

5. Logout:
   → POST /api/auth/logout
   ← Revoke refresh token
```

## Database Design

### Schema Principles

- **UUID primary keys** for better distribution
- **Soft deletes** via `deletedAt` column
- **Timestamps** on all tables (createdAt, updatedAt)
- **Indexes** on foreign keys and commonly queried fields

## Security

### Backend Security Layers

1. **Helmet** - HTTP headers security
2. **CORS** - Cross-origin resource sharing
3. **Throttler** - Rate limiting
4. **Guards** - JWT authentication
5. **Validation** - DTO validation & sanitization
6. **SQL** - Prisma prevents injection

### Frontend Security

1. **HTTPS** only in production
2. **CSP** headers
3. **Input validation** (Zod)
4. **XSS prevention** (React escaping)

## Performance

### Backend Optimizations

- Connection pooling (Prisma)
- Query optimization with indexes
- Response compression (gzip)
- Caching strategy (optional: Redis)

### Frontend Optimizations

- Next.js App Router (RSC, automatic code splitting)
- Image optimization (`next/image`)
- Font optimization (`next/font`)
- Production build with standalone output

## Deployment Architecture

### Docker Containers

```
docker-compose.yml
├── postgres     (port 5432)
├── backend      (port 3001)
└── frontend     (port 3000)
```

### Production Considerations

- **Environment variables** for secrets
- **Database migrations** via Prisma
- **Horizontal scaling** for backend
- **CDN** for frontend static assets
- **Load balancer** for backend instances

## Design Decisions

### Why Monorepo?

- ✅ Shared code reuse (types, validators)
- ✅ Atomic commits across FE/BE
- ✅ Simplified dependency management
- ✅ Unified tooling (TypeScript, Prettier, ESLint)

### Why pnpm?

- ✅ Fast & disk space efficient
- ✅ Strict package resolution
- ✅ Native workspace support

### Why NestJS?

- ✅ Enterprise-ready architecture
- ✅ TypeScript-first
- ✅ Rich ecosystem (Swagger, validation, etc.)
- ✅ Modular & testable

### Why Next.js 16?

- ✅ App Router with React Server Components
- ✅ Built-in optimizations (images, fonts, code splitting)
- ✅ API routes for BFF pattern
- ✅ Easy deployment (Vercel, self-hosted)

### Why Prisma?

- ✅ Type-safe database access
- ✅ Excellent migration system
- ✅ Auto-generated types
- ✅ Great developer experience

---

**For implementation details, see individual component READMEs in backend/ and frontend/**
