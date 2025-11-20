#!/bin/bash

# Check EventNest Application Status

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  EventNest Status Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check Docker
echo -n "Docker: "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

# Check Docker Compose
echo -n "Docker Compose: "
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null 2>&1; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo ""
echo -e "${BLUE}Container Status:${NC}"
echo ""

# Check if using docker-compose or docker compose
if command -v docker-compose &> /dev/null; then
    docker-compose ps
else
    docker compose ps
fi

echo ""
echo -e "${BLUE}Service Health:${NC}"
echo ""

# Check frontend
echo -n "Frontend (http://localhost:3000): "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Not responding${NC}"
fi

# Check backend
echo -n "Backend (http://localhost:4000):  "
if curl -s http://localhost:4000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Not responding${NC}"
fi

# Check database
echo -n "Database (localhost:3306):        "
if nc -z localhost 3306 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Not responding${NC}"
fi

echo ""
echo -e "${BLUE}Disk Usage:${NC}"
docker system df

echo ""
echo -e "${YELLOW}Tip: Run './scripts/logs.sh' to view application logs${NC}"
