# Makefile for Rampa Cash Web
# Usage: make up-dev (development) or make up (production)

.PHONY: help up up-dev down down-dev build build-dev logs logs-dev exec-dev install clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make up        - Start production container"
	@echo "  make up-dev    - Start development container with hot reloading"
	@echo "  make down      - Stop production container"
	@echo "  make down-dev  - Stop development container"
	@echo "  make build     - Build production image"
	@echo "  make build-dev - Build development image"
	@echo "  make logs      - Show production logs"
	@echo "  make logs-dev  - Show development logs"
	@echo "  make exec-dev  - Execute shell in development container"
	@echo "  make install   - Install npm packages in development container"
	@echo "  make clean     - Remove containers and images"

# Production commands
up:
	@echo "Starting production container..."
	docker-compose --profile prod up -d

down:
	@echo "Stopping production container..."
	docker-compose --profile prod down

build:
	@echo "Building production image..."
	docker-compose --profile prod build rampa-cash-web

logs:
	@echo "Showing production logs..."
	docker-compose --profile prod logs -f rampa-cash-web

# Development commands
up-dev:
	@echo "Starting development container with hot reloading..."
	docker-compose --profile dev up -d

down-dev:
	@echo "Stopping development container..."
	docker-compose --profile dev down

build-dev:
	@echo "Building development image..."
	docker-compose --profile dev build rampa-cash-web-dev

logs-dev:
	@echo "Showing development logs..."
	docker-compose --profile dev logs -f rampa-cash-web-dev

# Development utilities
exec-dev:
	@echo "Opening shell in development container..."
	docker-compose exec rampa-cash-web-dev sh

install:
	@echo "Installing npm packages in development container..."
	@read -p "Enter package name(s): " package; \
	docker-compose exec rampa-cash-web-dev npm install $$package

# Cleanup
clean:
	@echo "Cleaning up containers and images..."
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

# Status check
status:
	@echo "Production container status:"
	docker-compose --profile prod ps
	@echo ""
	@echo "Development container status:"
	docker-compose --profile dev ps 