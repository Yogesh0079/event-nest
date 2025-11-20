#!/bin/bash

# View EventNest Logs

echo "📋 EventNest Logs"
echo "Press Ctrl+C to exit"
echo ""

# Check if using docker-compose or docker compose
if command -v docker-compose &> /dev/null; then
    docker-compose logs -f --tail=100
else
    docker compose logs -f --tail=100
fi
