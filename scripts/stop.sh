#!/bin/bash

# Stop EventNest Application

echo "🛑 Stopping EventNest..."

# Check if using docker-compose or docker compose
if command -v docker-compose &> /dev/null; then
    docker-compose down
else
    docker compose down
fi

echo "✅ EventNest stopped!"
