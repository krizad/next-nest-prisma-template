# Contributing to Full-Stack Monorepo Template

Thank you for your interest in contributing! This document provides guidelines for getting started.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Install dependencies**: `pnpm install`
4. **Create a branch**: `git checkout -b feature/my-feature`
5. **Make your changes**
6. **Run checks**: `pnpm lint && pnpm typecheck && pnpm test`
7. **Commit**: `git commit -m "feat: description"`
8. **Push**: `git push origin feature/my-feature`
9. **Create a Pull Request** on GitHub

## 📋 Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- PostgreSQL 16 (or use Docker)

## 🛠️ Running the Project

```bash
# First-time setup
make setup

# Development (backend + frontend in parallel)
pnpm dev

# Backend only: http://localhost:8080
pnpm dev:backend

# Frontend only: http://localhost:3000
pnpm dev:frontend

# Type checking
pnpm typecheck

# Linting & formatting
pnpm lint
pnpm format

# Tests
pnpm test
```

## 📝 Code Standards

- Use TypeScript everywhere
- Use shared types from `@fullstack/shared-types` for DTOs
- Follow NestJS module structure for backend
- Prefer functional components in React
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Use `pnpm` exclusively (not npm or yarn)

## 🎯 What to Contribute

- ✅ Bug fixes
- ✅ New features (discuss first in an issue)
- ✅ Documentation improvements
- ✅ Performance optimizations
- ✅ Test additions
