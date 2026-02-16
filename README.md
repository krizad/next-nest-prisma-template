# Full-Stack Monorepo Template

A production-ready full-stack monorepo boilerplate combining **NestJS** (backend) and **Next.js** (frontend) with shared types via **pnpm workspaces**.

## 🚀 Features

### 🏗️ Architecture
- **Monorepo Structure** - pnpm workspaces with backend, frontend, and shared packages
- **Shared Types** - TypeScript types and Zod validators shared between FE/BE
- **Clean Architecture** - DDD patterns in backend with modular structure
- **Type Safety** - End-to-end type safety from database to UI

### 🔧 Backend (NestJS)
- **NestJS v11** - Modern, scalable Node.js framework
- **Prisma v7** - Type-safe ORM with TypedSQL & Extensions
- **PostgreSQL v16** - Robust relational database
- **JWT Authentication** - Access + refresh token flow
- **API Documentation** - Auto-generated Swagger/OpenAPI docs
- **Validation** - class-validator with transformation
- **Error Handling** - Unified exception filter
- **Security** - Helmet, CORS, rate limiting (throttler)

### 🎨 Frontend (Next.js)
- **Next.js v16** - React framework with App Router
- **React v19** - Latest React with server components
- **TypeScript** - Full type safety
- **Tailwind CSS v4** - Utility-first styling
- **Zod Validation** - Schema validation from shared-types
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Vitest** - Fast unit testing

### 📦 Shared Types
- **DTOs** - Shared data transfer objects (User, Auth, etc.)
- **Zod Schemas** - Validation schemas for runtime type checks
- **API Response Types** - Standardized API response/error formats
- **Constants** - Shared enums and constants (UserRole, etc.)

## 📁 Project Structure

```
fullstack-template/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── common/            # Shared utilities (guards, interceptors, decorators)
│   │   ├── config/            # Environment configuration
│   │   ├── infra/             # Infrastructure (Prisma, database)
│   │   └── modules/           # Feature modules (auth, users)
│   ├── prisma/                # Database schema & migrations
│   ├── docs/                  # Backend-specific documentation
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # React components
│   │   ├── features/          # Feature-based modules
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities & API client
│   │   ├── store/             # Zustand stores
│   │   └── types/             # Frontend-specific types
│   ├── docs/                  # Frontend-specific documentation
│   └── package.json
│
├── packages/
│   └── shared-types/          # Shared TypeScript types & validators
│       ├── src/
│       │   ├── dto/           # Data transfer objects
│       │   ├── types/         # Type definitions
│       │   └── constants/     # Shared constants
│       └── package.json
│
├── docs/                       # Monorepo documentation
│   ├── GETTING_STARTED.md
│   └── ARCHITECTURE.md
│
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── package.json               # Root package with scripts
├── turbo.json                 # Turborepo configuration
├── tsconfig.base.json         # Shared TypeScript config
├── .prettierrc                # Prettier configuration
└── Makefile                   # Development shortcuts

```

## 🎯 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL 16 (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/<OWNER>/<REPO>.git fullstack-app
cd fullstack-app

# Install dependencies
pnpm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start PostgreSQL (via Docker)
docker compose up -d postgres

# Run database migrations
pnpm db:setup

# Build shared-types package
pnpm --filter @fullstack/shared-types build
```

### Development

```bash
# Start both backend (8080) and frontend (3000) in parallel
pnpm dev

# Or start separately
pnpm dev:backend      # Backend only (http://localhost:8080)
pnpm dev:frontend     # Frontend only (http://localhost:3000)
```

### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **API Documentation**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **pgAdmin**: [http://localhost:5050](http://localhost:5050) (if running via Docker)

## 🛠️ Available Scripts

### Root Level

```bash
pnpm dev              # Start both backend and frontend
pnpm build            # Build all workspaces
pnpm test             # Run tests in all workspaces
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
pnpm clean            # Clean all node_modules and build outputs
pnpm db:setup         # Setup database (migrate + seed)
pnpm typecheck        # Type check all workspaces
```

### Backend

```bash
pnpm --filter @fullstack/backend dev           # Start dev server
pnpm --filter @fullstack/backend build         # Build for production
pnpm --filter @fullstack/backend test          # Run tests
pnpm --filter @fullstack/backend migrate:dev   # Run migrations
pnpm --filter @fullstack/backend seed          # Seed database
```

### Frontend

```bash
pnpm --filter @fullstack/frontend dev          # Start dev server
pnpm --filter @fullstack/frontend build        # Build for production
pnpm --filter @fullstack/frontend test         # Run tests
```

### Makefile Shortcuts

```bash
make setup           # First-time setup (install + db setup + build)
make dev             # Start development servers
make build           # Build all packages
make test            # Run all tests
make clean           # Clean build artifacts
make db-reset        # Reset database
```

## 🔌 API Integration

The frontend proxies API requests through Next.js rewrites:

- Frontend request: `GET /api/users`
- Proxied to: `http://localhost:8080/api/v1/users`

This eliminates CORS issues in development and provides seamless API integration.

### Using the API Client

```typescript
import { apiClient } from '@/lib/api-client';
import { isSuccessResponse } from '@fullstack/shared-types';
import type { UserDto } from '@fullstack/shared-types';

// Make API request
const response = await apiClient.get<UserDto[]>('/users');

// Handle response
if (isSuccessResponse(response)) {
  console.log('Users:', response.data);
  console.log('Context:', response.context);
} else {
  console.error('Error:', response.error.message);
}
```

## 📚 Documentation

- [Getting Started](docs/GETTING_STARTED.md) - Detailed setup guide
- [Architecture](docs/ARCHITECTURE.md) - System architecture & design decisions

### Backend Docs
- [Backend README](backend/README.md)
- [Backend Architecture](backend/docs/ARCHITECTURE.md)
- [Backend Quickstart](backend/docs/QUICKSTART.md)

### Frontend Docs
- [Frontend Getting Started](frontend/docs/GETTING_STARTED.md)
- [API Integration Guide](frontend/docs/API_INTEGRATION.md)
- [Customization Guide](frontend/docs/CUSTOMIZATION_GUIDE.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run backend tests only
pnpm test:backend

# Run frontend tests only
pnpm test:frontend

# Run with coverage
pnpm test:coverage
```

## 🚢 Deployment

### Docker

```bash
# Build and start all services
docker compose up -d

# Backend, frontend, and PostgreSQL will be running
```

### Production Build

```bash
# Build all packages
pnpm build

# Start backend
cd backend && pnpm start:prod

# Start frontend
cd frontend && pnpm start
```

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 8080)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGINS` - Allowed CORS origins

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - API base URL (default: /api)
- `NEXT_PUBLIC_BACKEND_URL` - Backend URL for rewrites (default: http://localhost:8080)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Next.js team for the powerful React framework
- Prisma team for the excellent ORM
- pnpm team for fast, disk space efficient package manager

---

**Happy coding! 🚀**
