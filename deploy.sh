#!/bin/bash

# EventNest Deployment Script
# This script handles the complete deployment of EventNest application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found!"
        print_info "Copying .env.example to .env..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before continuing"
        print_info "Especially update:"
        echo "  - JWT_SECRET (generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
        echo "  - EMAIL_* settings"
        read -p "Press enter when you've updated .env file..."
    else
        print_success ".env file found"
    fi
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        print_info "Please install Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        print_info "Please install Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Stop existing containers
stop_containers() {
    print_info "Stopping existing containers..."
    docker-compose down || docker compose down || true
    print_success "Containers stopped"
}

# Build and start containers
build_and_start() {
    print_info "Building Docker images..."
    docker-compose build --no-cache || docker compose build --no-cache
    
    print_info "Starting containers..."
    docker-compose up -d || docker compose up -d
    
    print_success "Containers started"
}

# Wait for services to be healthy
wait_for_services() {
    print_info "Waiting for services to be healthy..."
    
    local max_attempts=60
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose ps | grep -q "healthy" || docker compose ps | grep -q "healthy"; then
            print_success "Services are healthy!"
            return 0
        fi
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    
    print_warning "Services took longer than expected to start"
    print_info "Check logs with: docker-compose logs"
}

# Show container status
show_status() {
    print_header "Container Status"
    docker-compose ps || docker compose ps
}

# Show logs
show_logs() {
    print_header "Recent Logs"
    docker-compose logs --tail=50 || docker compose logs --tail=50
}

# Main deployment flow
main() {
    print_header "EventNest Deployment"
    
    print_info "Starting deployment process..."
    
    # Pre-flight checks
    check_docker
    check_docker_compose
    check_env_file
    
    # Deployment
    stop_containers
    build_and_start
    wait_for_services
    
    # Post-deployment
    show_status
    
    print_header "Deployment Complete!"
    print_success "EventNest is now running!"
    echo ""
    print_info "Access the application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:4000"
    echo "  Database: localhost:3306"
    echo ""
    print_info "Useful commands:"
    echo "  View logs:           ./scripts/logs.sh"
    echo "  Stop application:    ./scripts/stop.sh"
    echo "  Restart application: ./scripts/restart.sh"
    echo "  Database backup:     ./scripts/backup-db.sh"
    echo ""
    print_info "To view logs in real-time, run:"
    echo "  docker-compose logs -f"
}

# Run main function
main
