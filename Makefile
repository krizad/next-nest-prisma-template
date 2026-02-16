# Makefile สำหรับเปลี่ยนชื่อและรายละเอียดใน package.json ของ frontend และ backend ด้วย npm pkg set


set-project-name:
	@read -p "Enter new project name: " NAME; \
	npm --prefix ./frontend pkg set name="$$NAME"; \
	npm --prefix ./backend pkg set name="$$NAME"; \
	echo "Project name changed to $$NAME in both frontend and backend."


set-description:
	@read -p "Enter new description: " DESC; \
	npm --prefix ./frontend pkg set description="$$DESC"; \
	npm --prefix ./backend pkg set description="$$DESC"; \
	echo "Description changed to $$DESC in both frontend and backend."


set-author:
	@read -p "Enter new author: " AUTHOR; \
	npm --prefix ./frontend pkg set author="$$AUTHOR"; \
	npm --prefix ./backend pkg set author="$$AUTHOR"; \
	echo "Author changed to $$AUTHOR in both frontend and backend."


set-version:
	@read -p "Enter new version (e.g. 1.0.0): " VERSION; \
	npm --prefix ./frontend pkg set version="$$VERSION"; \
	npm --prefix ./backend pkg set version="$$VERSION"; \
	echo "Version changed to $$VERSION in both frontend and backend."

.PHONY: set-project-name set-description set-author set-version
.PHONY: help setup install clean dev build test lint format typecheck
.PHONY: dev-backend dev-frontend dev-shared
.PHONY: build-backend build-frontend build-shared
.PHONY: test-backend test-frontend test-watch test-cov test-e2e
.PHONY: lint-fix format-check
.PHONY: db-setup db-reset db-migrate db-migrate-deploy db-seed db-generate db-studio db-fresh
.PHONY: docker-up docker-down docker-logs docker-clean docker-restart docker-build
.PHONY: ci info check-env health start stop logs
.DEFAULT_GOAL := help

# Colors
CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RED    := \033[31m
NC     := \033[0m

# Config
COMPOSE := docker compose

##@ General

help: ## Display this help message
	@echo "$(CYAN)Full-Stack Monorepo - Make Commands$(NC)"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(CYAN)%-22s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Setup

setup: ## First-time project setup (install + db + shared-types)
	@echo "$(CYAN)Starting first-time setup...$(NC)"
	@$(MAKE) install
	@$(MAKE) build-shared
	@$(MAKE) docker-up-build
	@echo "$(YELLOW)Waiting for PostgreSQL to be ready...$(NC)"
	@sleep 5
	@$(MAKE) db-migrate
	@$(MAKE) db-seed
	@echo "$(GREEN)Setup complete! Run 'make dev' to start.$(NC)"

install: ## Install all dependencies
	@echo "$(CYAN)Installing dependencies...$(NC)"
	@pnpm install
	@echo "$(GREEN)Dependencies installed$(NC)"

clean: ## Clean all build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@pnpm clean:build 2>/dev/null || true
	@rm -rf backend/dist frontend/.next
	@echo "$(GREEN)Build artifacts cleaned$(NC)"

clean-all: clean docker-clean ## Clean everything (build + deps + docker)
	@echo "$(YELLOW)Cleaning node_modules...$(NC)"
	@pnpm clean:node-modules 2>/dev/null || rm -rf node_modules backend/node_modules frontend/node_modules packages/*/node_modules
	@echo "$(GREEN)Full cleanup complete$(NC)"

##@ Development

dev: ## Start all dev servers (backend + frontend)
	@echo "$(CYAN)Starting development servers...$(NC)"
	@echo "$(GREEN)  Backend:  http://localhost:8080$(NC)"
	@echo "$(GREEN)  Frontend: http://localhost:3000$(NC)"
	@echo "$(GREEN)  Swagger:  http://localhost:8080/api-docs$(NC)"
	@pnpm dev

dev-backend: ## Start only backend dev server
	@pnpm --filter @fullstack/backend dev

dev-frontend: ## Start only frontend dev server
	@pnpm --filter @fullstack/frontend dev

dev-shared: ## Watch shared-types for changes
	@pnpm --filter @fullstack/shared-types dev 2>/dev/null || pnpm --filter @fullstack/shared-types build --watch 2>/dev/null || echo "No watch target"

##@ Build

build: ## Build all packages
	@echo "$(CYAN)Building all packages...$(NC)"
	@pnpm build
	@echo "$(GREEN)Build complete$(NC)"

build-backend: ## Build backend only
	@pnpm --filter @fullstack/backend build

build-frontend: ## Build frontend only
	@pnpm --filter @fullstack/frontend build

build-shared: ## Build shared-types
	@pnpm --filter @fullstack/shared-types build

##@ Testing

test: ## Run all tests
	@pnpm test

test-backend: ## Run backend unit tests
	@pnpm --filter @fullstack/backend test

test-frontend: ## Run frontend tests
	@pnpm --filter @fullstack/frontend test

test-watch: ## Run tests in watch mode
	@pnpm --filter @fullstack/backend test:watch

test-cov: ## Run backend tests with coverage
	@pnpm --filter @fullstack/backend test:cov

test-e2e: ## Run e2e tests
	@pnpm --filter @fullstack/backend test:e2e

##@ Code Quality

lint: ## Lint all code
	@pnpm lint

lint-fix: ## Fix linting issues
	@pnpm lint:fix

format: ## Format code with Prettier
	@pnpm format

format-check: ## Check code formatting
	@pnpm format:check 2>/dev/null || pnpm --filter @fullstack/frontend format:check

typecheck: ## Type check all workspaces
	@pnpm typecheck

ci: lint typecheck test build ## Run full CI pipeline locally
	@echo "$(GREEN)All CI checks passed$(NC)"

##@ Database

db-setup: docker-up ## Setup database (start containers + migrate + seed)
	@echo "$(YELLOW)Waiting for PostgreSQL to be ready...$(NC)"
	@sleep 5
	@$(MAKE) db-migrate
	@$(MAKE) db-seed
	@echo "$(GREEN)Database setup complete$(NC)"

db-reset: ## Reset database (drop + recreate + migrate + seed)
	@echo "$(RED)Resetting database... All data will be lost!$(NC)"
	@$(COMPOSE) down
	@docker volume rm fullstack-template_postgres_data 2>/dev/null || true
	@$(COMPOSE) up -d postgres
	@echo "$(YELLOW)Waiting for PostgreSQL to be ready...$(NC)"
	@sleep 5
	@cd backend && pnpm run migrate:dev
	@cd backend && pnpm run seed
	@echo "$(GREEN)Database reset complete$(NC)"

db-migrate: ## Run database migrations (dev)
	@cd backend && pnpm run migrate:dev

db-migrate-deploy: ## Deploy migrations (production)
	@cd backend && pnpm run migrate:deploy

db-seed: ## Seed database with sample data
	@cd backend && pnpm run seed

db-generate: ## Generate Prisma client
	@cd backend && pnpm run generate

db-studio: ## Open Prisma Studio
	@cd backend && pnpm exec prisma studio

db-fresh: ## Fresh database (clean migrations + reset)
	@echo "$(YELLOW)Creating fresh database...$(NC)"
	@rm -rf backend/prisma/migrations
	@$(COMPOSE) down
	@docker volume rm fullstack-template_postgres_data 2>/dev/null || true
	@$(COMPOSE) up -d postgres
	@echo "$(YELLOW)Waiting for PostgreSQL to be ready...$(NC)"
	@sleep 5
	@cd backend && pnpm run migrate:dev -- --name init
	@cd backend && pnpm run seed
	@echo "$(GREEN)Fresh database created$(NC)"

##@ Docker

docker-up: ## Start all Docker services
	@echo "$(CYAN)Starting Docker services...$(NC)"
	@$(COMPOSE) up -d
	@echo "$(GREEN)Services started$(NC)"
	@echo "  $(GREEN)PostgreSQL: localhost:5432$(NC)"
	@echo "  $(GREEN)pgAdmin:    http://localhost:5050$(NC)"

docker-up-build: ## Start all Docker services
	@echo "$(CYAN)Starting Docker services...$(NC)"
	@$(COMPOSE) up -d --build
	@echo "$(GREEN)Services started$(NC)"
	@echo "  $(GREEN)PostgreSQL: localhost:5432$(NC)"
	@echo "  $(GREEN)pgAdmin:    http://localhost:5050$(NC)"


docker-down: ## Stop all Docker services
	@$(COMPOSE) down

docker-build: ## Build Docker images
	@$(COMPOSE) build

docker-logs: ## View Docker logs (follow)
	@$(COMPOSE) logs -f

docker-restart: ## Restart all Docker services
	@$(COMPOSE) restart

docker-clean: ## Clean Docker (containers + volumes)
	@echo "$(RED)Cleaning Docker resources...$(NC)"
	@$(COMPOSE) down -v
	@echo "$(GREEN)Docker cleanup complete$(NC)"

docker-ps: ## Show running containers
	@$(COMPOSE) ps

##@ Utilities

info: ## Show project information
	@echo "$(CYAN)Project Information$(NC)"
	@echo "  $(GREEN)Node:$(NC)     $$(node -v 2>/dev/null || echo 'Not installed')"
	@echo "  $(GREEN)pnpm:$(NC)     $$(pnpm -v 2>/dev/null || echo 'Not installed')"
	@echo "  $(GREEN)Docker:$(NC)   $$(docker -v 2>/dev/null | cut -d ' ' -f3 | tr -d ',' || echo 'Not installed')"
	@echo ""
	@echo "  $(GREEN)Backend:$(NC)  http://localhost:8080"
	@echo "  $(GREEN)Frontend:$(NC) http://localhost:3000"
	@echo "  $(GREEN)Swagger:$(NC)  http://localhost:8080/api-docs"
	@echo "  $(GREEN)Database:$(NC) localhost:5432"
	@echo "  $(GREEN)pgAdmin:$(NC)  http://localhost:5050  (admin@admin.com / admin)"
	@echo "  $(GREEN)Prisma:$(NC)   run 'make db-studio'"

check-env: ## Check environment configuration
	@echo "$(CYAN)Checking environment...$(NC)"
	@if [ ! -f backend/.env ]; then echo "  $(RED)backend/.env not found$(NC)"; else echo "  $(GREEN)backend/.env exists$(NC)"; fi
	@if [ ! -f frontend/.env.local ]; then echo "  $(YELLOW)frontend/.env.local not found (using defaults)$(NC)"; else echo "  $(GREEN)frontend/.env.local exists$(NC)"; fi

health: ## Check application health
	@echo "$(CYAN)Checking system health...$(NC)"
	@$(COMPOSE) ps 2>/dev/null || echo "  $(YELLOW)Docker not running$(NC)"
	@echo ""
	@curl -sf http://localhost:8080/api/health > /dev/null 2>&1 && echo "  $(GREEN)Backend (8080): Running$(NC)" || echo "  $(YELLOW)Backend (8080): Not running$(NC)"
	@curl -sf http://localhost:3000 > /dev/null 2>&1 && echo "  $(GREEN)Frontend (3000): Running$(NC)" || echo "  $(YELLOW)Frontend (3000): Not running$(NC)"

# Aliases
start: dev
stop: docker-down
logs: docker-logs
