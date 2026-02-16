# Getting Started

Complete guide to setting up and running the full-stack monorepo for the first time.

## Prerequisites

### Required Software

- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 9.0.0 (Install: `npm install -g pnpm`)
- **PostgreSQL** 16+ (or use Docker)
- **Git**

### Recommended Tools

- **VS Code** - Recommended IDE
- **Docker Desktop** - For running PostgreSQL easily
- **Postman** or **Insomnia** - For API testing

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url> my-fullstack-app
cd my-fullstack-app
```

### 2. Install Dependencies

The project uses pnpm workspaces. Install all dependencies from the root:

```bash
pnpm install
```

This will install dependencies for:
- Root-level tooling
- Backend (NestJS)
- Frontend (Next.js)
- Shared types package

### 3. Environment Configuration

#### Backend Environment

Copy the backend environment example and update values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```dotenv
# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack_db?schema=public"

# JWT (set to false for easier development)
JWT_ENABLED=false
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# CORS
CORS_ORIGINS=http://localhost:3000

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api-docs
```

#### Frontend Environment

Copy the frontend environment example:

```bash
cp frontend/.env.example frontend/.env.local
```

The defaults should work for development:

```dotenv
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 4. Start PostgreSQL

#### Option A: Using Docker (Recommended)

The backend includes a Docker Compose file for PostgreSQL:

```bash
# From project root
make docker-up

# Or manually
docker compose up -d postgres
```

PostgreSQL will be available at `localhost:5432`.

#### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:

1. Start PostgreSQL service
2. Create a database: `createdb fullstack_db`
3. Update `DATABASE_URL` in `backend/.env` with your credentials

### 5. Setup Database

Run migrations and seed the database:

```bash
# From project root
make db-setup

# Or manually
pnpm db:migrate
pnpm db:seed
```

This will:
- Create all database tables (users, refresh_tokens, etc.)
- Seed sample data (admin user, test users)

### 6. Build Shared Types

The shared-types package must be built before starting development:

```bash
pnpm --filter @fullstack/shared-types build
```

### 7. Start Development Servers

Start both backend and frontend:

```bash
make dev

# Or
pnpm dev
```

This will start:
- **Backend** on http://localhost:3001
- **Frontend** on http://localhost:3000

Access points:
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:3001/api/v1
- 📚 API Docs: http://localhost:3001/api-docs
- 🗄️ pgAdmin: http://localhost:5050 (if using Docker)

## Quick Setup (One Command)

For first-time setup, use the Makefile:

```bash
make setup
```

This runs:
1. `pnpm install`
2. Database migrations
3. Database seeding
4. Shared-types build

Then start development:

```bash
make dev
```

## Verify Installation

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3001/api/v1/health

# Expected response:
# {"success":true,"data":{"status":"ok","timestamp":"..."},"context":{...}}
```

### 2. Test Frontend

Open http://localhost:3000 in your browser. You should see the homepage.

### 3. Test API Integration

Try logging in with seeded credentials:
- Email: `admin@example.com`
- Password: `password123`

### 4. View API Documentation

Open http://localhost:3001/api-docs to explore the Swagger documentation.

## Common Issues

### Port Already in Use

If ports 3000 or 3001 are already in use:

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

Or change the port in `backend/.env`:

```dotenv
PORT=3002  # Use a different port
```

### Database Connection Failed

1. Ensure PostgreSQL is running:
   ```bash
   # Docker
   docker ps | grep postgres
   
   # Local
   pg_isready
   ```

2. Check `DATABASE_URL` in `backend/.env`

3. Verify you can connect manually:
   ```bash
   psql "postgresql://postgres:postgres@localhost:5432/fullstack_db"
   ```

### pnpm Not Found

Install pnpm globally:

```bash
npm install -g pnpm
```

### Build Errors in Shared Types

If you see import errors from `@fullstack/shared-types`, rebuild:

```bash
pnpm --filter @fullstack/shared-types build
```

### prisma generate Not Running

If Prisma types are missing:

```bash
cd backend
pnpm generate
```

## Next Steps

- Read [Development Workflow](DEVELOPMENT.md)
- Explore [Architecture](ARCHITECTURE.md)
- Check out [Backend Docs](../backend/docs/)
- Review [Frontend Docs](../frontend/docs/)

---

**🎉 You're all set! Happy coding!**
