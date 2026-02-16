# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Dependencies Stage ----
FROM base AS dependencies
# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json for backend and its workspace dependencies
COPY backend/package.json ./backend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ---- Build Stage ----
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build shared types (required for backend)
RUN pnpm --filter shared-types build
# Build backend
RUN pnpm --filter backend build
# Prune for production using pnpm deploy
RUN pnpm --filter backend --prod deploy ./pruned

# ---- Production Stage ----
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy necessary files from pruned directory and build output
COPY --from=build --chown=nestjs:nodejs /app/backend/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/pruned/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/pruned/package.json ./package.json
COPY --from=build --chown=nestjs:nodejs /app/backend/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/backend/prisma.config.ts ./prisma.config.ts

USER nestjs

EXPOSE 8080

CMD ["node", "dist/main"]
