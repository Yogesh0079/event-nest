#!/bin/bash

# Start EventNest Application

echo "🚀 Starting EventNest..."

# Check if using docker-compose or docker compose
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
else
    docker compose up -d
fi

echo "✅ EventNest started!"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000"
echo ""
echo "To view logs: ./scripts/logs.sh"
