.PHONY: help dev setup build start stop logs seed clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Initial setup — install dependencies
	cd backend && npm install
	cd admin-dashboard && npm install
	cp .env.example .env 2>/dev/null || true
	cp .env.example backend/.env 2>/dev/null || true
	@echo "✅ Setup complete! Edit .env with your settings."

dev-backend: ## Start backend in dev mode
	cd backend && npm run dev

dev-dashboard: ## Start dashboard in dev mode
	cd admin-dashboard && npm run dev

dev: ## Start all services in dev mode
	@echo "Starting backend..." && cd backend && npm run dev &
	@echo "Starting dashboard..." && cd admin-dashboard && npm run dev &
	@echo "✅ Dev servers starting..."

build: ## Build for production
	cd admin-dashboard && npm run build

docker-up: ## Start all Docker services
	docker-compose up -d --build

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

seed: ## Seed database with demo data
	cd backend && node src/seeders/seed.js

clean: ## Remove node_modules, dist, and logs
	rm -rf backend/node_modules backend/dist backend/logs
	rm -rf admin-dashboard/node_modules admin-dashboard/dist
	@echo "✅ Cleaned!"
